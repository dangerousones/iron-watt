FROM node:latest
MAINTAINER Kaiden Prince <me@kaidenprince.com>

RUN echo FORCE-REBUILD 1

RUN echo "deb http://ppa.launchpad.net/webupd8team/java/ubuntu xenial main" >> /etc/apt/sources.list \
    && echo "deb-src http://ppa.launchpad.net/webupd8team/java/ubuntu xenial main" >> /etc/apt/sources.list \
    && apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys EEA14886 \
    && echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections \
    && apt-get update && apt-get upgrade -y && apt-get -y dist-upgrade \
    && apt-get -y install oracle-java8-installer \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

EXPOSE 25565
VOLUME /usr/src/app/data
ENV DEBUG='IronWatt*'
WORKDIR /usr/src/app/data

ADD . /usr/src/app
RUN rm -rf ../node_modules

CMD ["bash", "../start.sh"]