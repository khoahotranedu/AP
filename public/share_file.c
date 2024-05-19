#include <stdio.h>
#include <stdlib.h>
#include <sys/mman.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>
#include <sys/wait.h>

#define FILENAME "shared_file.txt"
#define FILESIZE 4096

int main() {
    int fd;
    char* shared_memory;

    fd = open(FILENAME, O_CREAT | O_RDWR, S_IRUSR | S_IWUSR);
    if (fd == -1) {
        perror("open");
        exit(1);
    }
    if (ftruncate(fd, FILESIZE) == -1) {
        perror("ftruncate");
        exit(1);
    }


    shared_memory = (char*) mmap(NULL, FILESIZE, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
    if (shared_memory == MAP_FAILED) {
        perror("mmap");
        exit(1);
    }

    close(fd);

//sharing between two process
    pid_t child_pid = fork();
    if (child_pid == -1) {
        perror("fork");
        exit(1);
    } else if (child_pid == 0) {
        // children
        printf("Quy trinh con dang duoc ghi vaof bo nho chia se...\n");
        strcpy(shared_memory, "Xin chao tien trinh con!");
        printf("Du lieu duoc ghi boi tien trinh con: %s\n", shared_memory);
    } else {
        //parent
        wait(NULL);
        printf("Quy trinh cha dang doc bo nho chia se...\n");
        printf("Du lieu duoc doc boi quy trinh cha la: %s\n", shared_memory);
    }

    if (munmap(shared_memory, FILESIZE) == -1) {
        perror("munmap");
        exit(1);
    }

    

    return 0;
}



