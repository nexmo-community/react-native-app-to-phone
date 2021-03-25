package com.rnapptophone;

import android.annotation.SuppressLint;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.nexmo.client.NexmoCall;
import com.nexmo.client.NexmoCallHandler;
import com.nexmo.client.NexmoClient;
import com.nexmo.client.request_listener.NexmoApiError;
import com.nexmo.client.request_listener.NexmoRequestListener;

public class ClientManager extends ReactContextBaseJavaModule  {
    NexmoClient client;
    NexmoCall call;
    EventEmitter eventEmitter;

    ClientManager(ReactApplicationContext context) {
        super(context);
        client = new NexmoClient.Builder().build(context);
        eventEmitter =  new EventEmitter(context);
        client.setConnectionListener((connectionStatus, connectionStatusReason) ->
                this.sendEvent("onStatusChange", "status", connectionStatus.toString().toLowerCase()));
    }

    public String getName() {
        return "ClientManager";
    }

    private void sendEvent(String event, String name, String text) {
        WritableMap params = Arguments.createMap();
        params.putString(name, text);
        eventEmitter.sendEvent(event, params);
    }

    @ReactMethod
    public void login(String jwt) {
        client.login(jwt);
    }

    @SuppressLint("MissingPermission")
    @ReactMethod
    public void makeCall() {
        NexmoRequestListener<NexmoCall> callListener = new NexmoRequestListener<NexmoCall>() {
            @Override
            public void onSuccess(@Nullable NexmoCall nexmoCall) {
                call = null;
                call = nexmoCall;
                sendEvent("onCallStateChange", "state", "On Call");
            }

            @Override
            public void onError(@NonNull NexmoApiError apiError) {
                sendEvent("onCallStateChange", "state", "Idle");
            }
        };
        client.call("", NexmoCallHandler.SERVER, callListener);
    }

    @ReactMethod
    public void endCall() {
        NexmoRequestListener<NexmoCall> hangupCallListener = new NexmoRequestListener<NexmoCall>() {
            @Override
            public void onSuccess(@Nullable NexmoCall nexmoCall) {
                sendEvent("onCallStateChange", "state", "Idle");
                call = null;
            }

            @Override
            public void onError(@NonNull NexmoApiError apiError) {
                sendEvent("onCallStateChange", "state", "Idle");
            }
        };

        call.hangup(hangupCallListener);
    }
}