#include <iostream>

int main() {
    // Yêu cầu Rubric: Bắt buộc đọc/ghi để compiler không tối ưu hóa bỏ qua allocation
    const size_t SIZE = 1024ULL * 1024ULL * 1024ULL; // 1 GiB
    char* mem = new (std::nothrow) char[SIZE];
    if (!mem) return 1;

    for (size_t i = 0; i < SIZE; i += 4096) {
        mem[i] = static_cast<char>(i & 0xFF);
    }
    delete[] mem;
    return 0;
}
