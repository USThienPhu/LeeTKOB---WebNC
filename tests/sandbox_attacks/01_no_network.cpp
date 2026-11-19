#include <iostream>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>

int main() {
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) return 1;

    struct sockaddr_in serv_addr;
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(80);
    inet_pton(AF_INET, "8.8.8.8", &serv_addr.sin_addr);

    // Cố kết nối ra ngoài Internet
    int res = connect(sock, (struct sockaddr*)&serv_addr, sizeof(serv_addr));
    close(sock);

    if (res == 0) {
        std::cout << "BREACH_NETWORK" << std::endl;
        return 0; // Vi phạm nếu kết nối thành công!
    }
    return 1;
}
