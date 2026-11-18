int main() {
    volatile unsigned long long counter = 0;
    while (true) {
        counter++;
    }
    return 0;
}
