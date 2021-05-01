# ActivityDetailRecorder
The ActivityDetailRecorder is a Progressive Web App I created for my Senior Project at Dixie State University. It's purpose is to allow a user working for a specific company to generate their timesheet using their phone or other device capable of utilizing a browser. 

## Key Features
It utilizes pdfmake-wrapper (a TypeScript wrapper of pdfmake, which is a javascript library that generates pdfs) and idb (a wrapper for easier use of IndexedDB). It does not use a server or online database because all data is stored locally on the users device (thanks to idb). Also, because it is a PWA, a user can install the app to their mobile device's homescreen. In addition, this app is fully functional even while offline (including the pdf generation) after it has been loaded at least once. 

![image](https://user-images.githubusercontent.com/47042435/116797646-30cd0380-aaa5-11eb-927f-d86277587c6e.png)
![image](https://user-images.githubusercontent.com/47042435/116797653-5c4fee00-aaa5-11eb-9521-6279cb5c78e3.png)

