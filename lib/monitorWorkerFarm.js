var workerFarm = require('worker-farm');
var workers = workerFarm(require.resolve('./monitorWorker'));

var startWorker = function(workerId){
    
    var onComplete = function(err, output) {
        console.log('worker ' + workerId + 'completed');

        if (err) console.log(err);
        if (output) console.log(output);

        // Re-start worker.
        startWorker(workerId);
    }

    console.log('starting worker ' + workerId);
    workers(workerId, onComplete);
}

var startWorkers = function(numberOfWorkers)
{
    for (var i = 0; i < numberOfWorkers; i++) {
        startWorker('worker_' + i);
    }
}

module.exports.startWorkers = startWorkers;
