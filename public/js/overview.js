
var apiRoot = 'http://localhost:3000'


var Subscription = React.createClass({

    render: function() {
        return (
            <div className='subscription'>
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

    componentDidMount :function()
    {   
        // $(function () {
        //     var wall = new freewall('.topic');
        //     wall.fitWidth();
        // });
    },
 
    render: function() {

        var subscriptions = this.props.topic.subscriptions.map(
            function (subscription) {
            return (
                <Subscription key={subscription.name} subscription={subscription} />
            );
        });

        return (
            <div className='topic'>
                <h2>{this.props.topic.name}, bytes: {this.props.topic.sizeInBytes}</h2>
                <div>
                    {subscriptions}
                </div>
            </div>
        );
    }
});

/*
return { overview : [
            {
                "name": "some_other_topic",
                "created": 1442002277170,
                "sizeInBytes": 0,
                "subscriptions": []
            },
            {
                "name": "notifications",
                "created": 1441828881473,
                "sizeInBytes": 15314,
                "subscriptions": [
                    {
                        "name": "processor",
                        "created": 1441832829052,
                        "activeMessageCount": 1,
                        "deadLetterMessageCount": 0
                    },
                    {
                        "name": "creator",
                        "created": 1441829413339,
                        "activeMessageCount": 67,
                        "deadLetterMessageCount": 0
                    }
                ]
            }
        ]
    };
*/

var Overview = React.createClass({
    getInitialState: function() {
        return { overview : [] };
    },
    componentDidMount :function()
    {   
        var overview = this;

        $.get( "api", function( responseData ) {
            overview.setState({overview: responseData});
        });

        $(function () {
            var wall = new freewall('.overview');
            wall.fitWidth();
        });
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