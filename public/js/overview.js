
var apiRoot = 'http://localhost:3000'

var Overview = React.createClass({
    getInitialState: function() {
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
        return (
          <div className='overview'>
            <div className='topic'>topic render content</div>
            <div className='topic'>topic render content</div>
            <div className='topic'>topic render content</div>
          </div>
        );
    }
});


React.render(
  <Overview />,
  document.getElementById('overview')
);