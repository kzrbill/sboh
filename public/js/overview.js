
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

        $.get( "apiRoot", function( responseData ) {
            overview.setState({overview: responseData});
        });
    },
    render: function() {
        return (
          <p>(Overview grid render here)</p>
        );
    }
});


React.render(
  <Overview />,
  document.getElementById('overview')
);