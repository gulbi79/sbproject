/**
 * 공통 폼로딩 초기함수
 */
function gfn_formInit() {
	//1. 공통버튼 정의
	if (this?.com_viewinfo?.reportConfig !== true) $(".bConfig").hide();
}

function gfn_setComParams() {
	const viewinfo = this.com_viewinfo ?? {};
	let rtnParams = {};
	
	// 1. 체크 트리정보
	rtnParams = {...rtnParams, ...gfn_getChkTree()};

	// 2. 필터
	rtnParams = {...rtnParams, ...gfn_getFormObj($('.filterForm'))};
            
    // 3.dimension
    rtnParams.dimensionList = viewinfo?.arrDim?.map(v => v);

    // 4.measure
    rtnParams.measureList = viewinfo?.arrMea?.map(v => v);
    
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
 */
async function gfn_getCommonCode(params = {}) {
	const res = await gfn_service({
		url: 'common/code',
	    body: JSON.stringify({groupCd: params.groupCd}),
	});
	return res.data;
}

/**
 * 공통 서비스 함수
 */
async function gfn_service(pConfigs) {
	let serviceConfig = {
		url: '',
		method: 'post', 
		headers: { "Content-Type": "application/json", "REQSQL": pConfigs.reqSql ? "Y" : "N" , "AJAXYN": "Y"},
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
        const res = await fetch(GV_CONTEXT_PATH + serviceConfig.url, {
		    method: serviceConfig.method, 
		    headers: serviceConfig.headers,
		    body: serviceConfig.body
		});
									
		//Metro.activity.close(activity);
		
		if (!res.ok) throw res;
		
		const resData = await res.json();
		
		if (serviceConfig.headers.REQSQL === "Y") {
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
        
        //세션만료
        if (err.status === 403) {
        	console.log("세션이 만료되었습니다");
          	top.location.replace(GV_CONTEXT_PATH + "auth/login"); //여기서 최상위 프레임을 로그인 창으로 이동시킴
        } else {
	        err.text().then(async function(msg) {
				await gfn_alertSync({title: "Error", content: JSON.parse(msg).message});
			})
		}
                
    } finally {
		Metro.activity.close(activity);
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
		case 'CONFIG' :
			console.log("fType",fType);
			$("#comm_popup").css("width", "100%").css("height", "400px").attr("src", GV_CONTEXT_PATH+"popup/config");
			$('#c_popup').css('width','800px');
			setTimeout(function() { Metro.dialog.open('#c_popup',undefined,'Report Configuration') },100);
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

function gfn_localPopup(pType) {
	console.log("gfn_localPopup");
	if (typeof fn_comPopup === 'function') fn_comPopup(pType);
}

function gfn_addFilterData(el,type,data,defaultVal) {
	let elFilter;
	switch(type) {
		case 'select' :
			data.forEach(v => el.append('<option value="'+v.codeCd+'">'+v.codeNm+'</option>'));
            elFilter = Metro.getPlugin(el, "select");
            elFilter.reset();
            if (defaultVal) elFilter.val(defaultVal);
			break;
		case 'mselect' :
			data.forEach(v => el.append('<option value="'+v.codeCd+'" data-template="<input type=\'checkbox\' data-role=\'checkbox\' data-style=\'2\'> $1">'+v.codeNm+'</option>'));
			elFilter = Metro.getPlugin(el, "select");
			elFilter.reset();
			if (defaultVal) elFilter.val(defaultVal);
			break;
	}
	return elFilter;
}

