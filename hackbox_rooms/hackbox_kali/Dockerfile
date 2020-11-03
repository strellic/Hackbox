FROM kalilinux/kali-rolling

RUN useradd -ms /bin/bash user

RUN apt-get -y update && apt-get -y install curl openssh-server sudo iputils-ping netcat net-tools wordlists gobuster dirbuster sqlmap
RUN curl https://raw.githubusercontent.com/daviddias/node-dirbuster/master/lists/directory-list-2.3-medium.txt > /usr/share/wordlists/directory-list-2.3-medium.txt
RUN mkdir /var/run/sshd
RUN echo 'user:h4ckb0x' | chpasswd

RUN sed -i 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' /etc/pam.d/sshd

ENV NOTVISIBLE="in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile

CMD ["/usr/sbin/sshd", "-D"]
