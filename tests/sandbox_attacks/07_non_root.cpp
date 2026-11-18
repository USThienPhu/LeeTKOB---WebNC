#include <unistd.h>
#include <fstream>
#include <iostream>

int main() {
    if (getuid() == 0) {
        std::cout << "BREACH_RUNNING_AS_ROOT" << std::endl;
        return 0; // Vi phạm nếu là root
    }

    // Thử tạo file trong /root
    std::ofstream f("/root/test.txt");
    if (f.is_open()) {
        std::cout << "BREACH_RUNNING_AS_ROOT" << std::endl;
        return 0; // Vi phạm nếu ghi được vào /root
    }

    return 1;
}
