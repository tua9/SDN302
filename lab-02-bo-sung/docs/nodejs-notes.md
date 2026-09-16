# Node.js Notes

## (a) Why is Node.js called single-threaded but highly scalable?

Node.js runs JavaScript application code on one main thread. It can still handle many concurrent connections because I/O work is delegated to the operating system and Node.js's internal worker pool. The event loop then processes callbacks as those operations finish instead of waiting for each one synchronously. This makes Node.js efficient for applications with many I/O-bound requests, although CPU-heavy work can still block the main thread.

## (b) What does the event loop do while a file is being read?

When Node.js starts an asynchronous file read, it hands the operation to the operating system or its worker pool. The event loop remains available to process other callbacks, timers, and incoming requests while the file is being read. Once the read completes, its callback or promise continuation is placed in the appropriate queue. The event loop later runs that code with the file contents or an error.

## (c) Give one type of application Node.js is a poor fit for, and explain why.

Node.js is a poor fit for a program that performs long-running, CPU-intensive calculations on the main thread, such as large scientific simulations. Such calculations occupy the JavaScript thread and prevent the event loop from responding promptly to other work. Users may experience slow requests even when the application has little I/O. Worker threads or a different runtime would be more suitable for that workload.

## (d) What is the difference between a runtime environment and a framework?

A runtime environment provides the tools needed to execute a program, such as Node.js's JavaScript engine, standard library, and access to the operating system. A framework is a set of conventions and reusable components built on top of a runtime to help structure an application. Node.js is therefore a runtime environment, while Express is an example of a web framework that runs on Node.js. The runtime executes the code; the framework guides how the code is organized and handles common tasks.
