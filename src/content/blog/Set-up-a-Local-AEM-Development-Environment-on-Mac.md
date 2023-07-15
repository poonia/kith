---
title: How to Set Up AEM Local Development Environment on Mac
description: >-
  This article provides a step-by-step guide to setting up Adobe Experience
  Manager (AEM) locally on a Mac, including the installation of Maven and Java.
tags:
  - AEM
pubDate: 2023-05-02T04:00:00.000Z
---

This guide provides step-by-step instructions for setting up an AEM environment on your local machine, enabling you to develop applications effectively. By following these straightforward steps, you'll have AEM installed and running smoothly on your local machine in no time.

#### Minimum system requirements

* 5GB of free disk space for installation
* 2GB of RAM

#### Prerequisite for AEM Local Setup

* Java 8/11 (Open JDK or Oracle Java)
* Maven (3.5.3+)
* AEM Quickstart Jar with license

#### Basic steps to setup AEM local instance

##### [Java](#java)

AEM is Java based CMS. To begin you need to install Java language using JDK(Java Development Kit) which includes the Java Runtime Environment (JRE), Java compiler, and debugger. Once JDK is installed then you need to configure the environment variable `JAVA_HOME` for referencing Java required by AEM or elsewhere.

If Java(JDK) is already installed and system variables are already in place then you can directly jump to the [Maven](#maven) and [AEM](#AEM) steps.

Follow the below steps to download & Install Java JDK 11

* Use this [link](https://download.java.net/java/GA/jdk11/9/GPL/openjdk-11.0.2_osx-x64_bin.tar.gz) for jdk11 or download any specific from [jdk archive](https://jdk.java.net/archive/) to download the .tar.gz
* Use the following command given below to archive the tar files. Then, extract them to the directory of your choice. The preferred JDK setup directory is `/Library/Java/JavaVirtualMachines/`

```powershell
$ tar -xvf openjdk-11.0.2_osx-x64_bin.tar.gz
$ sudo mv jdk-11.0.2.jdk /Library/Java/JavaVirtualMachines/
```

Once JDK is installed, configure environment variables `JAVA_HOME` and `PATH`

* Depending upon the terminal shell, if it’s `bash` open `.bash_profile` or if it's `zsh` then open `.zshrc` and add the following entries at the bottom of the file -

```shell
JAVA_HOME="/Library/Java/JavaVirtualMachines/jdk-11.0.2.jdk/Contents/Home"
PATH="${JAVA_HOME}/bin:${PATH}"
export PATH
```

*NOTE: these files lie under the user root directory, they might be hidden by default. Use `cmd + Shift + .` to toggle show hide in finder.*

Once you have made these changes, you can relaunch the Terminal to apply the updated profile. Alternatively, you can run the commands `source .bash_profile` or `source .zshrc` to apply the updated environment variables.

To ensure JDK and `JAVA_HOME` is setup correctly you can verify using the below commands -


* For JDK, run `java -version` command. If installed properly you might see the following output -


```powershell
$ java -version
openjdk version "11.0.2" 2019-01-15
OpenJDK Runtime Environment 18.9 (build 11.0.2+9)
OpenJDK 64-Bit Server VM 18.9 (build 11.0.2+9, mixed mode)
```

If you may receive an alert message with the following warning:

```text
“jdk-11.0.2.jdk” cannot be opened because the developer cannot be verified.
macOS cannot verify that this app is free from malware
```

then go to System Preferences > Security and Privacy settings and then allow the app to execute by clicking on “Allow Anyway” button

* For `JAVA_HOME`, run echo $JAVA\_HOME command in the terminal.

##### [Maven](#maven)

Now you need to install Maven. The Maven is a tool that helps in simplifying & uniform the build processes, dependency management, etc. Just like JDK, you need to install Maven and configure the environment variable M2\_HOME.

Follow the below steps to install Maven and configure `M2_HOME` -

* Visit the [Maven website](https://maven.apache.org/download.cgi) to download Maven “Binary tar.gz archive” file.
* Extract after downloading `tar.gz` using the below command -

  `$ tar -xvf apache-maven-3.9.2-bin.tar.gz`
* Above will extract binaries in the `apache-maven-3.9.2` directory, which you can move anywhere you want.

Now set Maven environment variables  `M2_HOME` and `PATH`  based on the Maven directory

Depending upon the terminal shell, if it’s `bash` open  `.bash_profile` or if it's `zsh` then open `.zshrc` and add the following entries at the bottom of the file -

```shell
export M2_HOME="/Users/Alex/apache-maven-3.9.2"
PATH="${M2_HOME}/bin:${PATH}"
export PATH
```

Once you have made these changes, you can relaunch the Terminal to apply the updated profile. Alternatively, you can run the commands `source .bash_profile` or `source .zshrc` to apply the updated environment variables.

To ensure `mvn` and `M2_HOME` is setup correctly you can verify using the below commands -

Run the `mvn -version` command in the terminal, If installed properly you might see the following output -

```powershell
$ mvn -version
Apache Maven 3.9.2 (c9616018c7a021c1c39be70fb2843d6f5f9b8a1c)
Maven home: /Users/Alex/apache-maven-3.9.2
Java version: 11.0.2, vendor: Oracle Corporation, runtime: /Library/Java/JavaVirtualMachines/jdk-11.0.2.jdk/Contents/Home
Default locale: en_CA, platform encoding: UTF-8
OS name: "mac os x", version: "10.16", arch: "x86_64", family: "mac"
```

* For `M2_HOME`, run echo $M2\_HOME command in the terminal.

##### [AEM](#AEM)

Once Java and Maven are set up correctly, now is a good time to install AEM locally. If you don't have an AEM jar locally then you can download it from  [Adobe Licensing Website](https://licensing.adobe.com/ "download AEM here"), only valid users have access to this page.

Now once you have .jar and the license downloaded, follow the below steps to install AEM -

* Unzip the JAR file from the downloaded ZIP file and get a copy of the AEM QuickStart jar and a license.properties.
* Create a folder structure with any name like -

```treeview
aem/
|-- author/
|-- publish/
```

* Copy & Paste the AEM quickstart jar and [licence.properties](http://licence.properties) in both of the folders.
* Now rename the jar using the naming convention suggested by AEM as -

  `aem<optional-version-or-indentifier>-<standard-run-mode>-p<port-number>`
* By following this jar naming convention we set the run mode to author or publish and explicitly define the port number.

  eg - `aem6.5-author-p4502.jar, aem-author-p4502.jar, aem-publish-p4503.jar`

```treeview
aem/
|-- author/
|    |-- aem-author-p4502.jar
|    |-- license.properties
|-- publish/
|    |-- aem-publish-p4503.jar
|    |-- license.properties
```

* Now, to install the **Author** instance, double-click on the `aem-author-p4502.jar` file. This will start the author instance, which runs on port **4502** on the local computer. Similarly, we can install and start the publish instance.
* We can also install and start the jar using the below command in terminal  -

```powershell
$ java -jar aem-author-p4502.jar
$ java -jar aem-publish-p4503.jar
```

or we can follow as the run command Adobe suggested on their AEM docs -

```powershell
$ java -Xmx2048M -Xdebug -Xnoagent -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket, server=y,suspend=n,address=30303 -jar aem-author-p4502.jar -gui -r"author,localdev"
```

As the AEM instance started, we can visit [localhost:4502/](http://localhost:4502/a) for the author.

We can use the default username/password for local admin/admin to log in.

#### Conclusion

In this article, you explore how to set up Java and Maven to install and used AEM for web application development.

Thanks for Reading.
