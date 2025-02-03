class TimersManager {
    #timers
    #logs

    constructor() {
        this.#timers = [];
        this.#logs = [];
    }
    
    add(timer, ...args) {
        if (!timer || typeof timer.job !== "function" ||
            typeof timer.delay !== "number" || typeof timer.interval !== "boolean" ||
            typeof timer.name !== "string") {
            throw new Error("Incorrect timer object");
        }

        timer.id = null;
        this.#timers.push({timer, args});
        return this;
    }

    _log(name, result, args) {
        this.#logs.push({         
            
            name,
            args,
            result,
            timestamp: new Date().toISOString(),
        });
    }


    print() {
        setTimeout(() => {
            console.log(this.#logs);
        }, 1000)
    }

    remouse() {}
    start() {
        this.#timers.forEach(({ timer, args }) => {
            timer.id = setTimeout(() => {
                const result = timer.job(...args);
                this._log(timer.name, result, args);
            }, timer.delay);
        });

        this.#timers = [];
    }
    stop() {}
    pause() {}
    remove(timer) {
        const index = this.#timers.findIndex(item => item.timer === timer);
        if (index !== -1) {
            const [removed] = this.#timers.splice(index, 1);
            if (removed.timer.id) {
                clearTimeout(removed.timer.id);
            }
        }
    }   
   }


const manager = new TimersManager();
const t1 = {
    name: 't1',
    delay: 1000,
    interval: false,
    job: () => { console.log('t1') }
};

const t2 = {
    name: 't2',
    delay: 1000,
    interval: false,
    job: (a, b) => a + b
};

manager.add(t1).add(t2, 1, 2).start();
manager.print();
