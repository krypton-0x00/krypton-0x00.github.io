# NFS Enumeration

## Scan for open ports and services.
```
sudo nmap 10.129.14.128 -p111,2049 -sV -sC

```

## Run scripts to enumerate NFS shares.
```
sudo nmap --script nfs* 10.129.14.128 -sV -p111,2049
```

## Show Available NFS Shares

```
showmount -e 10.129.14.128

Export list for 10.129.14.128:
/mnt/nfs 10.129.14.0/24
```

## Mounting NFS Share

```
mkdir target-NFS
sudo mount -t nfs 10.129.14.128:/ ./target-NFS/ -o nolock
cd target-NFS
```

## List Contents with UIDs & GUIDs
```
ls -n mnt/nfs/

total 16
-rw-r--r-- 1 1000 1000 1872 Sep 25 00:55 test.priv
-rw-r--r-- 1 1000 1000  348 Sep 25 00:55 test.pub
-rw-r--r-- 1    0 1000 1221 Sep 19 18:21 test.sh
```

Note It is important to note that if the `root_squash` option is set, we cannot edit the `backup.sh` file even as `root`.

## Unmounting

```
cd ..
sudo umount ./target-NFS
```
