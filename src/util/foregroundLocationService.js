// src/util/foregroundLocationService.js
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import { getCurrentCoordsOnce, requestAndroidBackgroundPermission } from '../util/location';
import { store } from '../store';
import { DriverAvailableStatus, LOCATION_CONFIG } from '../constants';
import config from './config';
import { Platform } from 'react-native';
export const taskId = LOCATION_CONFIG.BG_TASK_ID;

let lastProcessedTimestamp = 0; // Add this variable to track the last sent location

const locationTask = async () => {
    // console.log('[BG TASK] Running even if app is closed!');
    const coords = await getCurrentCoordsOnce();
    // console.log('[BG TASK] Got coords:', coords);
    if (coords) {
        const { latitude, longitude, timestamp, heading } = coords;
        if (timestamp === lastProcessedTimestamp) {
            // console.log('Skipping duplicate location timestamp');
            return;
        }
        lastProcessedTimestamp = timestamp;
        const isFresh = (Date.now() - timestamp) < LOCATION_CONFIG.BG_LOCATION_FRESHNESS_THRESHOLD;
        const api_url = config.BASE_URL
        if (!isFresh) {
            console.log('Ignoring stale background location (timestamp too old)');
            return;
        }
        const state = store.getState();
        // console.log('state', state)
        const { driverInfo, access_token, device_token, userInfo: profile } = state.auth
        if (!driverInfo || !driverInfo?.Vehicle) {
            console.log('Background Task: Driver info missing, skipping update.');
            return;
        }
        const { company, model, colour, type } = driverInfo.Vehicle;
        const payload = {
            "driverId": profile.id,
            "location": { latitude, longitude, heading, timestamp },
            "category": driverInfo?.Vehicle?.VehicleType?.code,
            "status": DriverAvailableStatus.ONLINE,
            "driver": {
                "name": driverInfo?.name,
                ...(driverInfo?.email ? { email: driverInfo?.email } : {})
            },
            "vehicle": {
                company,
                model,
                colour,
                type: driverInfo?.Vehicle?.VehicleType?.code,
                registrationNumber: driverInfo?.Vehicle?.registration_number,
                type_id: type
            }
        };

        //console.log('BG Task - calling driver location api with payload:', payload.location, `${api_url}/location/location`);
        try {
            const res = await fetch(`${api_url}/location/location`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token}`, 'app-token': device_token },
                body: JSON.stringify(payload),
            });
            // const data = res.json();
            // console.log(data)
        } catch (e) { console.error("API Error", e); }
    } else {
        console.log('Task running but no coords found');
    }
};

export const startForegroundLocation = async () => {
    if (Platform.OS !== 'android') return;
    const granted = await requestAndroidBackgroundPermission();
    if (!granted) return;

    // We use (any) or a bracket-style object to bypass the 
    // missing ServiceType in the library's TS definition
    const startConfig = {
        id: 101,
        title: 'Pik bike tracking',
        message: 'Tracking your location for rides.',
        icon: 'icon',
        importance: '4',
        // USE CAPITAL "S" - many versions of this library look for exactly this.
        ServiceType: 'location',

        // --- ADD THESE TO KEEP IT ALIVE ---
        ongoing: true,          // Prevents the user from swiping the notification away
        autoCancel: false,      // Notification stays even after clicking
        setOnlyAlertOnce: true, // Stops the phone from vibrating/beeping every 10 seconds
    };
    ReactNativeForegroundService.start(startConfig);

    // Ensure task is added and running
    // console.log("Starting foreground location service add_task", ReactNativeForegroundService.get_all_tasks());
    if (!ReactNativeForegroundService.is_task_running(taskId)) {
        ReactNativeForegroundService.add_task(locationTask, {
            delay: LOCATION_CONFIG.BG_TASK_DELAY,
            onLoop: true,
            taskId: taskId,
            onError: (e) => console.log('Error in task:', e),
        });
    }
};

export const stopForegroundLocation = () => {
    console.log("Stopping foreground location service");
    ReactNativeForegroundService.stopAll(); // Stops service and the background task
    // ReactNativeForegroundService.remove_task(taskId); // Stops service and the background task

};

export const foreGroundService = () => {
    ReactNativeForegroundService.register({
        config: {
            alert: true,
            onServiceErrorCallBack: (err) => {
                console.error("Foreground service error occurred", err);
            },
            serviceType: 8,
        }
    });

    // Register task initially as well
    ReactNativeForegroundService.add_task(locationTask, {
        delay: LOCATION_CONFIG.BG_TASK_DELAY,
        onLoop: true,
        taskId: taskId,
        onError: (e) => console.log('Error in task:', e),
    });
}