// src/util/foregroundLocationService.js
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import { getCurrentCoordsOnce, requestAndroidBackgroundPermission } from '../util/location';
import { store } from '../store';
import { DriverAvailableStatus } from '../constants';
export const taskId = 'driver_tracking_task';


export const startForegroundLocation = async () => {
    const granted = await requestAndroidBackgroundPermission();
    if (!granted) return;

    // We use (any) or a bracket-style object to bypass the 
    // missing ServiceType in the library's TS definition
    const startConfig = {
        id: 101,
        title: 'Pik bike tracking',
        message: 'Tracking your location for rides.',
        icon: 'icon',
        importance: 'max',
        // USE CAPITAL "S" - many versions of this library look for exactly this.
        ServiceType: 'location',

        // --- ADD THESE TO KEEP IT ALIVE ---
        ongoing: true,          // Prevents the user from swiping the notification away
        autoCancel: false,      // Notification stays even after clicking
        setOnlyAlertOnce: true, // Stops the phone from vibrating/beeping every 10 seconds
    };

    ReactNativeForegroundService.start(startConfig);
};

export const stopForegroundLocation = () => {
    ReactNativeForegroundService.stopAll(taskId); // Stops service and the background task
};

export const foreGroundService = () => {
    ReactNativeForegroundService.register({
        config: {
            alert: true,
            onServiceErrorCallBack: () => {
                console.error("Foreground service error occurred");
            },
            serviceType: 8,
        }
    });

    ReactNativeForegroundService.add_task(async () => {
        console.log('[BG TASK] Running even if app is closed!');
        const coords = await getCurrentCoordsOnce();
        if (coords) {
            const { latitude, longitude } = coords;
            const state = store.getState();
            console.log('state', state)
            const { driverInfo, access_token, device_token, userInfo: profile } = state.auth
            const { company, model, colour, type } = driverInfo.Vehicle;
            const payload = {
                "driverId": profile.id,
                "location": { latitude, longitude },
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


            try {
                const res = await fetch('https://api.dev.pikbike.com/location/location', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token}`, 'app-token': device_token },
                    body: JSON.stringify(payload),
                });
                const data = res.json();
                console.log(data)
            } catch (e) { console.error("API Error", e); }
        } else {
            console.log('Task running but no coords found');
        }
    }, {
        delay: 30000,
        onLoop: true,
        taskId: taskId,
        onError: (e) => console.log('Error in task:', e),
    });
}