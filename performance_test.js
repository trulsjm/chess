// makea a list that is from 1 to 1 000 000
long_list = [];
for (let i = 0; i < 10000000; i++) {
    long_list.push(i*2);
}

for (let i = 0; i < long_list.length; i++) {
    el = long_list[i];
    var1 = el;
    var2 = el + 1;
    var3 = el + 2;
    var4 = el + 3;
    var5 = el + 4;
    var6 = el + 5;
    var7 = el + 6;
    var8 = el + 7;
    var9 = el + 8;
    var10 = el + 9;
    
    if (i % 100000 == 0) {
        console.log(var1+var2+var3+var4+var5+var6+var7+var8+var9+var10);
    }
    
}