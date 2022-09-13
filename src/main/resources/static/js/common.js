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
			gfn_comDimensionPopup();
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
	
	//if (typeof fn_comPopup1 === 'function') fn_comPopup1();
}

function gfn_comDimensionPopup() {
	console.log("gfn_comDimensionPopup");
	
    //데이터 초기화 및 그리드 데이터 생성
    com_viewinfo.selDimProvider.clearRows();
    com_viewinfo.selDimGrid.cancel();
    
	const dAllData = com_viewinfo.arrAllDim.map(v => { 
	    return {dimCd: v, dimNm: v}
	})

	const dSelData = com_viewinfo.arrDim.map(v => { 
	    return {dimCd: v, dimNm: v}
	})
    
    com_viewinfo.allDimProvider.setRows(dAllData);
    com_viewinfo.selDimProvider.setRows(dSelData);
    
    //이미 선택된 디멘전 체크
    let arrIdx = [];
	dSelData.forEach(v => {
		arrIdx.push(com_viewinfo.allDimGrid.getJsonRows().findIndex((element) => element.dimCd === v.dimCd));
	})
	com_viewinfo.allDimGrid.checkRows(arrIdx, true);

	Metro.dialog.open('#c_dimension')
}

function gfn_formInit() {
	//디멘전 팝업 생성
	if (com_viewinfo.dimension) {
		const fields = [ {fieldName: "dimCd", type: "data"} ];
	    const columns = [
	        {name: "dimNm",     type: "data", width: "150", header: {text: "Dimension"      }, styleName: "tal-column" }
	    ];
	    const options = {
			checkBar: { visible: true }
		  , stateBar: { visible: false }
		};
		
	    const gridInstanceAllDim = new GRID().init({gridId: "dimensionPopupAllGrid", draw: true, columns: columns, fields: fields, options: options});
        com_viewinfo.allDimGrid = gridInstanceAllDim.gridview;
        com_viewinfo.allDimProvider = gridInstanceAllDim.provider;

	    const gridInstanceSelDim = new GRID().init({gridId: "dimensionPopupSelGrid", draw: true, columns: columns, fields: fields, options: options});
        com_viewinfo.selDimGrid = gridInstanceSelDim.gridview;
        com_viewinfo.selDimProvider = gridInstanceSelDim.provider;
        
        com_viewinfo.selDimProvider.softDeleting = false; //바로삭제
        
        //체크박스 이벤트 등록
        com_viewinfo.allDimGrid.onItemChecked = function (grid, itemIndex, checked) {
    		let sDimCd = grid.getValue(itemIndex, "dimCd");
    		
    		//1. 체크시 추가 - 상위체크항목을 찾아서 바로 아래 추가, 체크된 항목이 없으면 첫번째 추가
    		if (checked) {
				let row = grid.getDataRow(itemIndex);
				let addIdx = 0;
				let checkedRows = grid.getCheckedRows();
				let fPIdx = checkedRows.findIndex(v => v === row);
				if (fPIdx > 0) {
					fPIdx = checkedRows[fPIdx-1];
					addIdx = com_viewinfo.selDimGrid.getJsonRows().findIndex(v => v.dimCd === com_viewinfo.allDimProvider.getValue(fPIdx,"dimCd")) + 1;
				}
				let jsonRow = com_viewinfo.allDimProvider.getJsonRow(row);
				com_viewinfo.selDimProvider.insertRow(addIdx, jsonRow);

    		//2. 체크해제시 삭제
    		} else {
	    		let fRow = com_viewinfo.selDimGrid.getJsonRows().findIndex(v => v.dimCd === sDimCd);
	    		com_viewinfo.selDimProvider.removeRow(fRow);
			}
		};
		
		com_viewinfo.allDimGrid.onItemAllChecked = function (grid, checked) {
		    console.log('All checked as ' + checked);
		    if (checked) {
				com_viewinfo.selDimProvider.clearRows();
				let jsonrows = com_viewinfo.AllDimGrid.getJsonRows();
				com_viewinfo.selDimProvider.setRows(jsonrows);
			} else {
				com_viewinfo.selDimProvider.clearRows();
			}
		};
	}
}


