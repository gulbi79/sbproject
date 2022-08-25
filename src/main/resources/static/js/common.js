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
	
	//server api 요청
	fetch(serviceConfig.url, {
	    method: serviceConfig.method, 
	    headers: serviceConfig.headers,
	    body: serviceConfig.body
	})
    .then(res => {
		if (!res.ok) throw res;
			
		return res.json(); //응답 결과를 json으로 파싱
	}) 
    .then(serviceConfig.successCallback)
    .catch(err => {
        err.text().then(async function(msg) {
			if (serviceConfig.headers.REQ_SQL === "Y") {
				gfn_alert({title: "Excute SQL", width: 800, closeButton: true, content: "<div style='overflow:auto;height:500px;white-space:pre;'>"+JSON.parse(msg).message+"</div>"});
			} else {
				await gfn_alertSync({title: "Error", content: JSON.parse(msg).message});
			}
			
		})
    });
}

/**
 * Tree 체크데이터 배열로 리턴
 */
function gfn_getChkTree() {
    var rtnObj = {};
    Array.from($("#treetabs li a")).forEach(function(vt) {
        var treeId = $(vt).attr("href");
        var chkNodes = Array.from($(treeId+" input[type=checkbox]:checked"));
        var arrChkVals = chkNodes.filter(function(v) {
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
	console.log("gfn_onCalendarShow");
}

function gfn_onCalendarHide(el, cal) {
    console.log("gfn_onCalendarHide");
}

function gfn_commButton(fType) {
	console.log("gfn_commButton");
	switch (fType) {
		case 'DIMENSION' :
			break;
		case 'MEASURE' :
			break;
		case 'EXCEL' :
			if (typeof fn_comExportExcel === 'function') fn_comExportExcel();
			break;
		case 'SQL' :
			if (typeof fn_apply === 'function') fn_apply(true);
			break;
	}
}

function gfn_commPopup(pType) {
	console.log("gfn_commPopup");
	switch (pType) {
		case 'COMM1' :
			if (typeof fn_comPopup1 === 'function') fn_comPopup1();
			break;
		case 'COMM2' :
			if (typeof fn_comPopup2 === 'function') fn_comPopup2();
			break;
	}
}
