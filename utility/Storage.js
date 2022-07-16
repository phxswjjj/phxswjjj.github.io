

Storage.prototype.getItemExp = function (key) {
    const item = JSON.parse(this.getItem(key));
    if (!item.expiry)
        return item;
    else {
        const now = new Date();
        if (now.getTime() > item.expiry) {
            this.removeItem(key);
            return null;
        } else
            return item.value;
    }
};
Storage.prototype.setItemExp = function (key, value, ttl) {
    if (!ttl) {
        this.setItem(key, value);
        return;
    }
    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + ttl
    }
    this.setItem(key, JSON.stringify(item));
};
