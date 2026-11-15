import socket
import json
import time

IP = "146.59.1.3"
PORT = 20800

def check_server():
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(3)
    try:
        result = sock.connect_ex((IP, PORT))
        return result == 0
    except:
        return False
    finally:
        sock.close()

print("Rozpoczęto monitorowanie serwera Conan Exiles...")

while True:
    is_online = check_server()
    data = {
        "online": is_online,
        "players": "2/10" if is_online else "0/10"
    }
    
    with open("status.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print(f"[{time.strftime('%H:%M:%SCUL')}] Status zaktualizowany -> Online: {is_online}")
    time.sleep(60) # Sprawdza co 60 sekund