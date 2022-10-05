//차트 생성로직
document.write('<script src="'+GV_CONTEXT_PATH+'static/chartjs/chart.min.js" type="text/javascript"></script>');
document.write('<script src="'+GV_CONTEXT_PATH+'static/chartjs/chartjs-plugin-datalabels.min.js" type="text/javascript"></script>');

const CHART_COLORS = [
  '#4dc9f6',
  '#f67019',
  '#f53794',
  '#537bc4',
  '#acc236',
  '#166a8f',
  '#00a950',
  '#58595b',
  '#8549ba'
];

const CHART_NAME_COLORS = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};

const CHARTJS = function() {
    this.defConfig = {
        type: 'bar',
        plugins: [ChartDataLabels],
		options: {
			plugins: {
		    	title: {
		        	display: false,
		        	text: '',
		        	align: 'center',
		        	font: {
                        size: 20
                    },
		      	},
		      	datalabels: {
					display: false,
				}
		    },
		    scales: {
	            yAxes: [{
	                ticks: {
	                    callback: function(value, index, values) {
	                        return value !== 0 ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
	                    }
	                }
	            }]
	        },
	        tooltips: {
	            callbacks: {
	                label: function(tooltipItem, data) {
	                    let label = data.datasets[tooltipItem.datasetIndex].label || '';
	
	                    if (label) {
	                        label += ': ';
	                    }
	                    label += tooltipItem.yLabel !== 0 ? tooltipItem.yLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
	                    return label;
	                }
	            }
	        }
	    }
    };
};

CHARTJS.prototype = {
    init: function(ctx, options) {
		this.defConfig = gfn_util_merge(this.defConfig, options);
		return new Chart(ctx, this.defConfig);
	},
}
