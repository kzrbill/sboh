

function formatBytes(bytes,decimals) {
   if(bytes == 0) return '0 Byte';
   var k = 1000;
   var dm = decimals + 1 || 3;
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
   var i = Math.floor(Math.log(bytes) / Math.log(k));
   return (bytes / Math.pow(k, i)).toPrecision(dm) + ' ' + sizes[i];
}


var apiRoot = 'http://localhost:3000'


var socket = io();

var Subscription = React.createClass({
    getInitialState: function() {
        return { subscription : this.props.subscription };
    },
    componentDidMount :function()
    {   
        var component = this;
        socket.on('subscriptionUpdated', function(subscription){
            console.log('subscriptionUpdated');
            component.setProps({subscription: subscription});
        });
    },
    render: function() {

        var deadCount = this.props.subscription.deadLetterMessageCount;
        var className = deadCount > 0 ? 'subscription critical' : 'subscription normal';

        return (
            <div className={className} >
                <h3>{this.props.subscription.name}</h3>
                <ul>
                    <li><strong>{this.props.subscription.deadLetterMessageCount}</strong> <span>deadletters</span> </li>
                    <li><strong>{this.props.subscription.activeMessageCount}</strong> <span>messages</span> </li>
                </ul>
            </div>
        );
    }
});

var Topic = React.createClass({
    render: function() {

        var subscriptions = this.props.topic.subscriptions.map(
            function (subscription) {
            return (
                <Subscription key={subscription.name} subscription={subscription} />
            );
        });

        var size = formatBytes(this.props.topic.sizeInBytes);

        return (
            <div className='topic'>
                <h2><span className='heading'>{this.props.topic.name}</span> <span className='size'>({size})</span></h2>
                <br />
                <div>
                    {subscriptions}
                </div>
            </div>
        );
    }
});

var Overview = React.createClass({
    getInitialState: function() {
        return { overview : [] };
    },
    componentDidMount :function()
    {   
        var overview = this;

        function getOverview() {
            $.get( "api", function( responseData ) {
                overview.setState({overview: responseData});
            }); 
        }
        
        getOverview();
        setInterval(function () {getOverview()}, 3000);
    },
    render: function() {

        var topics = this.state.overview.map(
            function (topic) {
            return (
                <Topic key={topic.name} topic={topic} />
            );
        });

        return (
          <div className='overview'>
            {topics}
          </div>
        );
    }
});

React.render(
  <Overview />,
  document.getElementById('overview')
);