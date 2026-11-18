#include <unistd.h>
#include <fstream>

int main() {
    if (getuid() == 0) return 0; // Vi phạm nếu là root

    // Thử tạo file trong /root
    std::ofstream f("/root/test.txt");
    if (f.is_open()) return 0; // Vi phạm nếu ghi được vào /root

    return 1;
}
