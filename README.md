# 🚀 Apache Cassandra Read/Write Path & Compaction (Node.js + Docker)

## 📌 Project Overview
This project demonstrates how **Apache Cassandra** works internally with:

- Write Path (CommitLog → Memtable → SSTable)
- Read Path (Memtable → Bloom Filter → SSTable)
- SSTable creation
- Manual Compaction process
- Integration with a Node.js application

---

## 📥 Clone Repository

```bash
git clone https://github.com/shubhsalunke/Apache-Cassandra-Read-Write-Path-Compaction.git
cd Apache-Cassandra-Read-Write-Path-Compaction
````

---

## 🧰 Tech Stack

* Apache Cassandra 4.1 (Docker)
* Node.js (v20+)
* Cassandra Driver (Node.js)
* Docker Compose

---

## ⚙️ Setup Instructions

### 1️⃣ Install Dependencies

```bash
sudo apt update -y
sudo apt install -y docker.io docker-compose-v2 curl git

sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker ubuntu
newgrp docker
```

### Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

node -v
npm -v
```

---

## 📁 Project Structure

```
Apache-Cassandra-Read-Write-Path-Compaction/
│
├── docker-compose.yml
├── README.md
├── .gitignore
└── app/
    ├── index.js
    ├── package.json
```

---


### Start Cassandra

```bash
docker compose up -d
```

Verify:

```bash
docker exec -it task8-cassandra nodetool status
```

---

## 🗄️ Cassandra Database Setup

```bash
docker exec -it task8-cassandra cqlsh
```

```sql
CREATE KEYSPACE task8_demo
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

USE task8_demo;

CREATE TABLE user_events (
  user_id text,
  event_time timestamp,
  event_type text,
  details text,
  PRIMARY KEY (user_id, event_time)
)
WITH CLUSTERING ORDER BY (event_time DESC)
AND compaction = {'class': 'SizeTieredCompactionStrategy'};

EXIT;
```

---

## ⚡ Node.js Setup

```bash
cd app
npm init -y
npm install cassandra-driver
```

---

## ▶️ Run Application

```bash
node index.js
```

---

## 🔍 Verification Steps

### Check CommitLog

```bash
docker exec -it task8-cassandra bash -c "ls -lh /var/lib/cassandra/commitlog"
```

### Flush Memtable

```bash
docker exec -it task8-cassandra nodetool flush task8_demo user_events
```

### Generate More Data

```bash
for i in {1..5}; do node index.js; done
```

### Run Compaction

```bash
docker exec -it task8-cassandra nodetool compact task8_demo user_events
```

### Final Check

```bash
docker exec -it task8-cassandra nodetool tablestats task8_demo.user_events
```

---

## 🧠 Concepts

### Write Path

```
Client → CommitLog → Memtable → SSTable
```

### Read Path

```
Client → Memtable → Bloom Filter → SSTable
```

### Compaction

```
Multiple SSTables → Merge → Single SSTable
```

---

## 🎯 Result

* Cassandra deployed successfully
* Node.js integrated
* Write path verified
* Read path verified
* SSTables created
* Compaction completed
