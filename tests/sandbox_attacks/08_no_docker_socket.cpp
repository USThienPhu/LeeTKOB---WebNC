#include <sys/stat.h>
#include <iostream>

int main() {
    struct stat buffer;
    // Kiểm tra không thấy docker.sock
    if (stat("/var/run/docker.sock", &buffer) == 0) {
        std::cout << "BREACH_DOCKER_SOCKET_FOUND" << std::endl;
        return 0; // Vi phạm nếu phát hiện socket
    }
    return 1;
}
