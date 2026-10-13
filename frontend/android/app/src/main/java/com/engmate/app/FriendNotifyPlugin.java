package com.engmate.app;

import android.Manifest;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.graphics.Color;
import android.os.Build;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

/**
 * System notifications for friend activity: a chat message, or a challenge to
 * a Grammar Battle. They go on a high-importance channel, so Android shows
 * them as heads-up banners with sound and vibration over whatever is on screen.
 * Tapping one brings the app back and tells the web layer which screen to open.
 *
 * Written here rather than with @capacitor/local-notifications, whose
 * Capacitor 8 build needs a Java 21 toolchain this project does not use.
 */
@CapacitorPlugin(
    name = "FriendNotify",
    permissions = @Permission(strings = { Manifest.permission.POST_NOTIFICATIONS }, alias = FriendNotifyPlugin.PERMISSION)
)
public class FriendNotifyPlugin extends Plugin {

    static final String PERMISSION = "notifications";
    private static final String CHANNEL_ID = "friends";
    private static final String EXTRA_URL = "engmate_notification_url";
    private static final int BRAND_COLOR = Color.parseColor("#3525CD");

    @Override
    public void load() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID, "Friends", NotificationManager.IMPORTANCE_HIGH);
            channel.setDescription("Messages and battle invites from friends");
            channel.enableVibration(true);
            channel.setVibrationPattern(new long[] { 0, 300, 120, 300 });
            channel.enableLights(true);
            channel.setLightColor(BRAND_COLOR);
            NotificationManager nm = getContext().getSystemService(NotificationManager.class);
            if (nm != null) nm.createNotificationChannel(channel);
        }
    }

    /** Both a tap while running and a cold start from a tap arrive here. */
    @Override
    protected void handleOnNewIntent(Intent intent) {
        super.handleOnNewIntent(intent);
        if (intent == null) return;
        String url = intent.getStringExtra(EXTRA_URL);
        if (url == null) return;
        intent.removeExtra(EXTRA_URL); // so a later re-delivery does not replay it

        JSObject data = new JSObject();
        data.put("url", url);
        // Kept until the web layer subscribes, which on a cold start is later.
        notifyListeners("notificationTap", data, true);
    }

    @PluginMethod
    public void requestPermission(PluginCall call) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU
                || getPermissionState(PERMISSION) == PermissionState.GRANTED) {
            resolveGranted(call);
            return;
        }
        requestPermissionForAlias(PERMISSION, call, "permissionCallback");
    }

    @PermissionCallback
    private void permissionCallback(PluginCall call) {
        resolveGranted(call);
    }

    private void resolveGranted(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("granted", NotificationManagerCompat.from(getContext()).areNotificationsEnabled());
        call.resolve(ret);
    }

    @PluginMethod
    public void show(PluginCall call) {
        int id = call.getInt("id", 1);
        String title = call.getString("title", "Engmate");
        String body = call.getString("body", "");
        String url = call.getString("url");

        Intent open = new Intent(getContext(), MainActivity.class)
            .setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        if (url != null) open.putExtra(EXTRA_URL, url);
        PendingIntent tap = PendingIntent.getActivity(
            getContext(), id, open, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(getContext(), CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_stat_engmate)
            .setColor(BRAND_COLOR)
            .setContentTitle(title)
            .setContentText(body)
            .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
            // Android 7 and older have no channels; these do the channel's job.
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setDefaults(NotificationCompat.DEFAULT_ALL)
            .setCategory(NotificationCompat.CATEGORY_MESSAGE)
            .setAutoCancel(true)
            .setContentIntent(tap);

        try {
            NotificationManagerCompat.from(getContext()).notify(id, builder.build());
            call.resolve();
        } catch (SecurityException e) {
            call.reject("Notifications are not allowed.");
        }
    }
}
