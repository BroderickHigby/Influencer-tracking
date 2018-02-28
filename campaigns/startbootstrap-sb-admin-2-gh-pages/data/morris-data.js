$(function() {

    Morris.Area({
        element: 'morris-area-chart',
        data: [{
            period: '2010 Q1',
            conversions: 2666
        }, {
            period: '2010 Q2',
            conversions: 2778
        }, {
            period: '2010 Q3',
            conversions: 4912
        }, {
            period: '2010 Q4',
            conversions: 3767
        }, {
            period: '2011 Q1',
            conversions: 6810
        }, {
            period: '2011 Q2',
            conversions: 5670
        }, {
            period: '2011 Q3',
            conversions: 4820
        }, {
            period: '2011 Q4',
            conversions: 15073
        }, {
            period: '2012 Q1',
            conversions: 10687
        }, {
            period: '2012 Q2',
            conversions: 8432
        }],
        xkey: 'period',
        ykeys: ['conversions'],
        labels: ['Conversions'],
        pointSize: 2,
        hideHover: 'auto',
        resize: true
    });

    Morris.Donut({
        element: 'morris-donut-chart',
        data: [{
            label: "Download Sales",
            value: 12
        }, {
            label: "In-Store Sales",
            value: 30
        }, {
            label: "Mail-Order Sales",
            value: 20
        }],
        resize: true
    });

    Morris.Bar({
        element: 'morris-bar-chart',
        data: [{
            y: '2006',
            a: 100,
            b: 90
        }, {
            y: '2007',
            a: 75,
            b: 65
        }, {
            y: '2008',
            a: 50,
            b: 40
        }, {
            y: '2009',
            a: 75,
            b: 65
        }, {
            y: '2010',
            a: 50,
            b: 40
        }, {
            y: '2011',
            a: 75,
            b: 65
        }, {
            y: '2012',
            a: 100,
            b: 90
        }],
        xkey: 'y',
        ykeys: ['a', 'b'],
        labels: ['Series A', 'Series B'],
        hideHover: 'auto',
        resize: true
    });

});
