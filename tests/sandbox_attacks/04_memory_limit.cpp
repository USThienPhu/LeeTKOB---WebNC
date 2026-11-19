#include <iostream>

int main() {
    // Yêu cầu Rubric: Bắt buộc đọc/ghi để compiler không tối ưu hóa bỏ qua allocation
    const size_t SIZE = 1024ULL * 1024ULL * 1024ULL; // 1 GiB
    char* mem = new (std::nothrow) char[SIZE];
    if (!mem) {
        std::cerr << "std::bad_alloc: memory allocation limit exceeded" << std::endl;
        return 1;
    }

    // Ghi vào từng trang bộ nhớ
    for (size_t i = 0; i < SIZE; i += 4096) {
        mem[i] = static_cast<char>(i & 0xFF);
    }

    // Bắt buộc đọc lại để compiler không tối ưu hóa loại bỏ allocation
    volatile long long sum = 0;
    for (size_t i = 0; i < SIZE; i += 4096) {
        sum += mem[i];
    }

    std::cout << "Checksum: " << sum << std::endl;
    delete[] mem;
    return 0;
}
