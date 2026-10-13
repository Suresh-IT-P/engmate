package com.engmate.app;

import android.content.Context;
import android.media.AudioDeviceInfo;
import android.media.AudioManager;
import android.os.Build;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Switches call audio between the earpiece and the loudspeaker.
 *
 * WebRTC inside the WebView puts Android into communication mode, which plays
 * through the earpiece by default, and no web API can change that route — so
 * the switch has to happen natively.
 */
@CapacitorPlugin(name = "AudioRoute")
public class AudioRoutePlugin extends Plugin {

    @PluginMethod
    @SuppressWarnings("deprecation") // setSpeakerphoneOn is the only option before Android 12
    public void setSpeaker(PluginCall call) {
        boolean on = Boolean.TRUE.equals(call.getBoolean("on", false));
        AudioManager am = (AudioManager) getContext().getSystemService(Context.AUDIO_SERVICE);
        boolean speaker = on;

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            if (on) {
                speaker = false;
                for (AudioDeviceInfo device : am.getAvailableCommunicationDevices()) {
                    if (device.getType() == AudioDeviceInfo.TYPE_BUILTIN_SPEAKER) {
                        speaker = am.setCommunicationDevice(device);
                        break;
                    }
                }
            } else {
                // Hand the choice back to the system: the earpiece, or a
                // headset if one is connected. The selection also outlives the
                // call unless cleared, so this doubles as the reset.
                am.clearCommunicationDevice();
            }
        } else {
            am.setSpeakerphoneOn(on);
        }

        JSObject ret = new JSObject();
        ret.put("speaker", speaker);
        call.resolve(ret);
    }
}
