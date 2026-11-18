#include <chrono>
#include <thread>

int main() {
    // Ngủ 60s không tốn CPU -> Thử thách wall-clock limit phải kill container
    std::this_thread::sleep_for(std::chrono::seconds(60));
    return 0;
}
