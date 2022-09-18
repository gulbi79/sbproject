/**
 * 공통 폼로딩 초기함수
 */
function gfn_formInit() {
	
}

function gfn_setComParams() {
	const viewinfo = this.com_viewinfo ?? {};
	let rtnParams = {};
	
	// 1. 체크 트리정보
	rtnParams = {...rtnParams, ...gfn_getChkTree()};

	// 2. 필터
	rtnParams = {...rtnParams, ...gfn_getFormObj($('.filterForm'))};
            
    // 3.dimension
    rtnParams.dimensionList = viewinfo?.arrDim?.map(v => { return { dimCd: v, dimNm: v } });
    
    return rtnParams;
}

/**
 * Tree 체크데이터 배열로 리턴
 */
function gfn_getChkTree() {
    const rtnObj = {};
    Array.from($("#treetabs li a")).forEach(function(vt) {
        const treeId = $(vt).attr("href");
        const chkNodes = Array.from($(treeId+" input[type=checkbox]:checked"));
        let arrChkVals = chkNodes.filter(function(v) {
            return $($(v).parent().siblings("ul")).find(".check").length === 0;
        }).map(function(v) {
            return v.dataset.uniqval; //v.value;
        });

        rtnObj[treeId] = arrChkVals;
    });
	return rtnObj;
}

/**
 * input 값을 object로 리턴
 * @param {*} $ele
 */
function gfn_getFormObj($ele) {
    var o = {};
    //var elements = $('.filterForm').find('input, select');
    var elements = $ele.find('input, select');
    elements.each(function() {
        if (this.name === null || this.name === undefined || this.name === '') return;

        var elemValue = null;
        var $this = $(this);
        if ($this.is('select')) {
            var select = Metro.getPlugin(this, "select");
            elemValue = select.val();
        } else {
            if ($this.attr("type") === "checkbox" || $this.attr("type") === "radio") {
                if (!$this.prop("checked")) return;

                elemValue = this.value;

            } else if ($this.attr("data-role") === "calendarpicker") {
                elemValue = this.value.replace(/-/g, '');
            } else {
                elemValue = this.value;
            }
        }

        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(elemValue || '');
        } else {
            o[this.name] = elemValue || '';
        }
    });

    return o;
}

/**
 * 공통 서비스 함수
 */
async function gfn_service(pConfigs) {
	let serviceConfig = {
		url: '',
		method: 'post', 
		headers: { "Content-Type": "application/json", "REQ_SQL": pConfigs.reqSql ? "Y" : "N" },
	    body: null,
	    successCallback: null,
	    errorCallback: null
	};
	
	serviceConfig = {...serviceConfig, ...pConfigs};
	
	// loading bar start
	const activity = Metro.activity.open({
        type: 'ring',
        overlayColor: '#fff',
        //style: 'color',
        //overlayClickClose: true
    });
	
	//server api 요청
	try {
        const res = await fetch(serviceConfig.url, {
		    method: serviceConfig.method, 
		    headers: serviceConfig.headers,
		    body: serviceConfig.body
		});
									
		Metro.activity.close(activity);
		
		if (!res.ok) throw res;
		
		const resData = await res.json();
		
		if (serviceConfig.headers.REQ_SQL === "Y") {
			const data = resData.data;
			let strSql = "";
			for (key in data) {
				strSql += data[key] + "\n\n";
			}
			gfn_alert({title: "Excute SQL", width: 800, closeButton: true, content: "<div style='overflow:auto;height:500px;white-space:pre;'>"+strSql+"</div>"});
			return null;
		} else {
			return resData; //응답 결과를 json으로 파싱
		}					
									
    } catch (err) {
        console.log(err);
        err.text().then(async function(msg) {
			await gfn_alertSync({title: "Error", content: JSON.parse(msg).message});
		})
    }
    
    return null;
}

/**
 * async confirm
 */
function gfn_confirm(options) {
    var Utils = Metro.utils;
    var alertConfig = {
        title: "Confirm",
        width: 480,
        content: "",
        okCaption: "OK",
        cancelCaption: "Cancel",
        okCallback: null,
        cancelCallback: null,
    };
    alertConfig = {...alertConfig, ...options};
    Metro.dialog.create({
        title: alertConfig.title,
        width: alertConfig.width,
        content: alertConfig.content,
        actions: [{
            caption: alertConfig.okCaption,
            cls: "js-dialog-close alert",
            onclick: function() {
                if (Utils.isFunc(alertConfig.okCallback)) {
					Utils.exec(alertConfig.okCallback);
				}
            }
        }, {
            caption: alertConfig.cancelCaption,
            cls: "js-dialog-close",
            onclick: function() {
                if (Utils.isFunc(alertConfig.cancelCallback)) {
					Utils.exec(alertConfig.cancelCallback);
				}
            }
        }]
    });
}

/**
 * async alert
 */
function gfn_alert(options) {
    var Utils = Metro.utils;
    var alertConfig = {
        title: "Alert",
        width: 480,
        content: "",
        okCaption: "OK",
        okCallback: null,
    };
    alertConfig = {...alertConfig, ...options};
    Metro.dialog.create({
        title: alertConfig.title,
        width: alertConfig.width,
        content: alertConfig.content,
        closeButton: alertConfig.closeButton,
        actions: [{
            caption: alertConfig.okCaption,
            cls: "js-dialog-close alert",
            onclick: function() {
                if (Utils.isFunc(alertConfig.okCallback)) {
					Utils.exec(alertConfig.okCallback);
				}
            }
        }]
    });
}

/**
 * sync confirm
 */
function gfn_confirmSync(options) {
    return new Promise(function(resolve, reject) {
        var Utils = Metro.utils;
        var alertConfig = {
            title: "Confirm",
            width: 480,
            content: "",
            okCaption: "OK",
            cancelCaption: "Cancel",
            okCallback: null,
            cancelCallback: null,
        };
        alertConfig = {...alertConfig, ...options};
        Metro.dialog.create({
            title: alertConfig.title,
            width: alertConfig.width,
            content: alertConfig.content,
            actions: [{
                caption: alertConfig.okCaption,
                cls: "js-dialog-close alert",
                onclick: function() {
                    if (Utils.isFunc(alertConfig.okCallback)) {
                        Utils.exec(alertConfig.okCallback);
                    }
                    resolve(true);
                }
            }, {
                caption: alertConfig.cancelCaption,
                cls: "js-dialog-close",
                onclick: function() {
                    if (Utils.isFunc(alertConfig.cancelCallback)) {
                        Utils.exec(alertConfig.cancelCallback);
                    }
                    reject(false);
                }
            }]
        });
    });
}

/**
 * sync alert
 */
function gfn_alertSync(options) {
    return new Promise(function(resolve, reject) {
        var Utils = Metro.utils;
        var alertConfig = {
            title: "Alert",
            width: 480,
            content: "",
            okCaption: "OK",
            okCallback: null,
        };
        alertConfig = {...alertConfig, ...options};
        Metro.dialog.create({
            title: alertConfig.title,
            width: alertConfig.width,
            content: alertConfig.content,
            actions: [{
                caption: alertConfig.okCaption,
                cls: "js-dialog-close alert",
                onclick: function() {
                    if (Utils.isFunc(alertConfig.okCallback)) {
                        Utils.exec(alertConfig.okCallback);
                    }
                    resolve(true);
                }
            }]
        });
    });
}

function gfn_onCalendarShow(el, cal) {
	//console.log("gfn_onCalendarShow",el,cal);
	const adjFix = 3;
	const obj = $(el[0]);
	const parentObj = $(el[0]).parent();
	let divRight = $(".filterForm").width() - 10;
	let right = parentObj.left() + obj.width() + adjFix;
	let pRight = parentObj.left() + parentObj.width();
	
	//console.log("divRight",divRight,"right",right);
	
	//부모넓이가 자식보다 크면 우측에 붙임
	if(parentObj.width() > obj.width()) {
		obj.left(parentObj.width() - obj.width() - adjFix);
	} else if (divRight < right) {
		obj.left((right - pRight)*-1);
	} else {
		obj.left(0);
	}
}

function gfn_onCalendarHide(el, cal) {
    console.log("gfn_onCalendarHide");
}

function gfn_commButton(fType) {
	console.log("gfn_commButton");
	switch (fType) {
		case 'DIMENSION' :
			gfn_comDimensionPopup();
			break;
		case 'MEASURE' :
			break;
		case 'EXCEL' :
			if (typeof fn_comExportExcel === 'function') {
				fn_comExportExcel() 
			} else {
				gfn_exportExcel(VIEW_GRID_LIST.gridview[0], {});
			}
			break;
		case 'SQL' :
			if (typeof fn_apply === 'function') fn_apply(true);
			break;
	}
}

function gfn_commPopup(pType) {
	console.log("gfn_commPopup");
	switch (pType) {
		case 'COMM_DIMENSION' :
			_gfn_commDimension();
			break;
		case 'COMM2' :
			if (typeof fn_comPopup2 === 'function') fn_comPopup2();
			break;
	}
}

function _gfn_commDimension() {
	console.log("call _gfn_commDimension");
	//iframe의 함수를 호출
	$("#comm_popup").get(0).contentWindow.fn_apply();
}

function gfn_comDimensionPopup() {
	console.log("gfn_comDimensionPopup");
	$("#comm_popup").css("width", "100%").css("height", "400px").attr("src", GV_CONTEXT_PATH+"popup/dimension");
	Metro.dialog.open('#c_popup');
}




