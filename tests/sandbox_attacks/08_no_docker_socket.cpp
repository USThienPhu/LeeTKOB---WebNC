#include <sys/stat.h>

int main() {
    struct stat buffer;
    // Kiểm tra không thấy docker.sock
    if (stat("/var/run/docker.sock", &buffer) == 0) {
        return 0; // Vi phạm nếu phát hiện socket
    }
    return 1;
}
