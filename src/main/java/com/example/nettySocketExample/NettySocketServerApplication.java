package com.example.nettySocketExample;

import com.corundumstudio.socketio.AckRequest;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.DataListener;
import com.example.nettySocketExample.object.*;
import jakarta.annotation.PreDestroy;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;


@Component
public class NettySocketServerApplication implements CommandLineRunner {

    public final SocketIOServer socketIOServer;
    Map<String, Player> playerMap = new HashMap<>();

    public NettySocketServerApplication(SocketIOServer socketIOServer) {
        this.socketIOServer = socketIOServer;
    }

    @Override
    public void run(String... args) {

        socketIOServer.start();

        // broadcast each 50ms
        new Thread(() -> {
            while(true) {
                try {
                    Thread.sleep(50);
                    socketIOServer.getBroadcastOperations().sendEvent("state", playerMap);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }).start();

        // first connection with client
        socketIOServer.addConnectListener(client -> {
            System.out.println("Client connected: " + client.getSessionId());

            Player player = Player.builder()
                    .playerId(client.getSessionId().toString())
                    .x(300)
                    .y(300)
                    .build();

            playerMap.put(client.getSessionId().toString(), player);
            client.sendEvent("currentPlayer", player);
        });

        socketIOServer.addEventListener("playerMove", PlayerMovementData.class,
                (client, data, ackSender) -> {
            String playerId = client.getSessionId().toString();
            Player player = playerMap.get(playerId);
            if(player != null) {
                player.setX(data.getX());
                player.setY(data.getY());
                playerMap.put(playerId, player);
            }
        });

        socketIOServer.addEventListener("playerHit", PlayerHitData.class, new DataListener<PlayerHitData>() {
            @Override
            public void onData(SocketIOClient client, PlayerHitData data, AckRequest ackRequest) {
                System.out.println("Player hit: " + data.getPlayerId() + " Damage: " + data.getDamage());

                // 피격 정보를 모든 클라이언트에 브로드캐스트
                client.getNamespace().getBroadcastOperations().sendEvent("playerHit", data);
            }
        });

        socketIOServer.addDisconnectListener(client -> {
            playerMap.remove(client.getSessionId().toString());
            System.out.println("Client.disconnected: " + client.getSessionId());
        });
    }

    @PreDestroy
    public void stop() {
        System.out.println("System stop");
        socketIOServer.stop();
    }
}