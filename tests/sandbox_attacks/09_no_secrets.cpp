#include <cstdlib>
#include <iostream>

int main() {
    const char* keys[] = {"MODEL_API_KEY", "GEMINI_API_KEY", "OPENAI_API_KEY", "API_KEY"};
    for (const char* k : keys) {
        if (std::getenv(k) != nullptr) {
            std::cout << "BREACH_SECRET_FOUND" << std::endl;
            return 0; // Vi phạm nếu đọc được key
        }
    }
    return 1;
}
