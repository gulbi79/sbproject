/**
 * RealGrid2 Utility
 * 리얼그리드 활용 방법에 대한 예제로 만들어진 함수들 입니다.
 * realgrid-utils 함수들에 대한 기술 지원은 따로 하지 않습니다.
 * 소스 수정 및 배포등 자유롭게 사용하시기 바랍니다.
 */

window.onunload = function() {
	console.log("window.onunload call...");
	gfn_gridsDestroy(); //화면에서 생성한 grid destroy
	if (typeof fn_unload === 'function') fn_unload();
}

const GRID_TOTAL_COLOR = ["#f7f3e9","#f7e9f6","#f7e9e9","#f0f7e9","#e9f7f3","#eae9f7"];

var VIEW_GRID_LIST = {
	gridview: [],
	provider: []
};

var GRID = function() {
    this.gridview;
    this.provider;
    this.defConfig = {
        gridId: "realgrid",
        fields: null,
        columns: null,
        draw: true,
        dimensions: [],
        measure: false,
    };
};

GRID.prototype = {
    init: function(options) {
        this.setConfig(options);
        this.provider = new RealGrid.LocalDataProvider(true);
        this.gridview = new RealGrid.GridView(this.defConfig.gridId);
        this.gridview.setDataSource(this.provider);
        this.setGlobalGrid();
        this.setOptions();
        this.setEvents();
        
        if (this.defConfig.draw) this.setDraw();
        
        return this;
    },
    
    treeInit: function(options) {
        this.setConfig(options);
        this.provider = new RealGrid.LocalTreeDataProvider(true);
        this.gridview = new RealGrid.TreeView(this.defConfig.gridId);
        this.gridview.setDataSource(this.provider);
        this.setGlobalGrid();
        this.setOptions();
        
        if (this.defConfig.draw) this.setDraw();
        
        return this;
    },
    
    setConfig: function(options) {
        this.defConfig = {...this.defConfig, ...options};
    },
    
    setGlobalGrid: function() {
		VIEW_GRID_LIST.gridview.push(this.gridview);
		VIEW_GRID_LIST.provider.push(this.provider);
	},
	
	setOptions : function() {
		let defaultOptions = {
	        panel	: { visible: false },
	        footer	: { visible: false },
	        checkBar: { visible: false },
	        stateBar: { visible: false },
	        sorting : { 
				enabled: false,
				handleVisibility: "visible",
				style: "exclusive" //1.exclusive : 단일정렬, 2.inclusive : 멀티정렬, 3.reverse : 멀티역방향정렬
			},
	        sortMode: "explicit",
	        undoable: true,
	        edit    : { insertable: true, appendable: false, updatable: true, editable: true, deletable: true, commitWhenLeave: true},
	        header  : {
	            heightFill: "fixed",
	            showTooltip: true,
	            showPopupMenu: "visible"
	        },
	        display : {
		        showEmptyMessage : true,
	        	emptyMessage: "",
	        	editItemMerging : true,
				rowHeight : 21,
	        }
	    };
	    
	    //defaultOptions = {...defaultOptions, ...this.defConfig.options};
	    defaultOptions = gfn_util_merge(defaultOptions, this.defConfig.options);
	    
		this.gridview.setOptions(defaultOptions);
	    
		this.gridview.setPasteOptions({
			checkReadOnly: true,
			enableAppend: false,
			eventEachRow: true,
			forceColumnValidation : true,
			forceRowValidation : true,
			stopOnError : true,
			checkDomainOnly : true,
			noEditEvent : true,
			selectBlockPaste: true,
			convertLookupLabel: true,
		});
	
		this.gridview.setCopyOptions({
			lookupDisplay: true,
		});
	
		//필터링 옵션 설정
		this.gridview.setFilteringOptions({
			clearWhenSearchCheck: true,
			selector: {
				showSearchInput: true,
				showButtons: true,
				acceptText: "OK",
				cancelText: "CANCEL"
			}
		});
		
		this.gridview.setFormatOptions({ numberFormat: '#,##0.###' });
		
		this.provider.setOptions({
			commitBeforeDataEdit: true,
			restoreMode: "auto",
	    	softDeleting: true //삭제시 상태값만 바꾼다.
	    });
	},
	
	setEvents : function() {
		const that = this.gridview;
		this.provider.onRowCountChanged = function (provider, newCount) {
			let display = that.getDisplayOptions();
			if (display.showEmptyMessage) {
			    display.emptyMessage = "Data Not Found!";
			    that.setDisplayOptions(display);
			}
		};
		
		that.onContextMenuItemClicked = function(grid, item, clickData) {
			gfn_contextMenuItemClicked(grid, item, clickData);
		};
	},

    setDraw: function() {
		this.gridview.setColumns(null);
		this.provider.setFields(null);
		
		let fields = [{fieldName : "grpId"}];
		if (this.defConfig.measure) {
			fields.push({fieldName : "measureId"});
			fields.push({fieldName : "measureSort"});
		}
		
		//추가 fields
		if (this.defConfig.fields) {
			fields = [...fields, ...this.defConfig.fields];
		}
		
        if (this.defConfig.columns) {
            this.defConfig.columns = this.defConfig.columns.map(function(v) {
                var f = {fieldName: v.name};
                if (v.tag) f = {...f, ...v.tag};
                v = {...v, ...f};
                fields.push({fieldName: v.fieldName, ...v.tag});
                return v;
            });

            //fieldsName으로 중복제거
            //fields = [...new Map(fields.map(item => [item["fieldName"], item])).values()]; //es6문법
            fields = [...new Map(fields.map(function(item) {
                return [item["fieldName"], item];
            })).values()];
            
            this.provider.setFields(fields);
            this.gridview.setColumns(this.defConfig.columns);
            
            //context
			gfn_setContextMenu(this.gridview);
        }
    },
    
    setDimension : function(arrDim = []) {
		this.defConfig.dimensions = arrDim.map(v => {
			return {...v, dimCd: gfn_util_camelCase(v.dimCd)};
		})
	},
	
	setDimensionMerge : function() {
		let tmpPrevDim = "";
		this.defConfig.dimensions.forEach((v, idx) => {
			if (idx === 0) this.gridview.columnByName(v.dimCd).mergeRule = {criteria: "value"};
			else this.gridview.columnByName(v.dimCd).mergeRule = {criteria: tmpPrevDim+" + value"};
			
			tmpPrevDim += (tmpPrevDim === "" ? "" : " + ") + "values['"+v.dimCd+"'] ";
		})
	},
	
	setMeasure : function(bMeasure = false) {
		this.defConfig.measure = bMeasure;
	},
}

function gfn_drawDynamicGrid(gridInstance, bucketlist, options) {
	let defConfig = {
		bucketType: "MONTH_WEEK",
		bTotal1: false,
		bTotal2: false,
		bTotal3: false,
	};
	
	defConfig = {...defConfig, ...options};
	
	const arrBucketType    = defConfig.bucketType.split('_');
	const firstBucketType  = arrBucketType[0];
	const lastBucketType   = arrBucketType[arrBucketType.length-1];
	const arrLowBucketType = arrBucketType.map(v => v.toLowerCase());
	
	//dyco1lumns 앞뒤로 디멘전, 고정컬럼  --------------------------------
	
	//디멘전
	let dimcolumns = gridInstance.defConfig.dimensions.map(v => {
		return { name: v.dimCd, type: "data", width: "90", header: {text: v.dimNm, styleName: "vam-column"}, styleName: "tal-column", sortable : false };
	})
	
	//메저
	let meacolumns = [];
	if (gridInstance.defConfig.measure) {
		meacolumns = [{ name: "measureNm", type: "data", width: "100", header: {text: "Category", styleName: "vam-column"}, styleName: "tal-column", sortable : false }];
	}

	//dycolumns Bucket --------------------------------
	let bucketcolumns = bucketlist.filter(v => v.calType === lastBucketType).map(function(vv) {
		return { name: vv.prefix+vv.bucketcol, type: "data", width: "90", header: {text: vv.prefix+vv.bucketcol}, styleName: "tar-column", tag: {dataType: "number"} }
	});
	
	//bucket sub total - 최상위 ------------------
	if (defConfig.bTotal1) {
		bucketcolumns = [...bucketcolumns, { name: "bucketTotal", type: "data", width: "90", header: {text: "전체 Total"}, styleName: "tar-column", tag: {dataType: "number"} }];
	}

	//bucket sub total - 최상위 ------------------
	if (defConfig.bTotal2 && arrBucketType.length > 1) {
		const stbucketcolumns1 = bucketlist.filter(v => v.calType === arrBucketType[0]).map(function(vv) {
			return { name: vv.prefix+vv.bucketcol, type: "data", width: "90", header: {text: vv.prefix+vv.bucketcol+" Total"}, styleName: "tar-column", tag: {dataType: "number"} }
		});
		bucketcolumns = [...bucketcolumns, ...stbucketcolumns1];
	}

	//bucket sub total - 최하위 상위 상위 ------------------
	if (defConfig.bTotal3 && arrBucketType.length > 2) {
		const stbucketcolumns2 = bucketlist.filter(v => v.calType === arrBucketType[1]).map(function(vv) {
			return { name: vv.prefix+vv.bucketcol, type: "data", width: "90", header: {text: vv.prefix+vv.bucketcol+" Total"}, styleName: "tar-column", tag: {dataType: "number"} }
		});
		bucketcolumns = [...bucketcolumns, ...stbucketcolumns2];
	}
	
	//style 적용
	const dimStyleCallback = function(grid, dataCell) {
		var ret = {};
  		var grpId = grid.getValue(dataCell.index.itemIndex, "grpId");
  		if (grpId > 0 && dataCell.value === "Total") ret.styleName = "dyl"+grpId+"-column";
  		return ret;
	}

	const meaStyleCallback = function(grid, dataCell) {
		var ret = {};
  		var grpId = grid.getValue(dataCell.index.itemIndex, "grpId");
  		if (grpId > 0) ret.styleName = "dyl"+grpId+"-column";
  		return ret;
	}

	const bucketStyleCallback = function(grid, dataCell) {
		var ret = {};
  		var grpId = grid.getValue(dataCell.index.itemIndex, "grpId");
  		if (grpId > 0) ret.styleName = "dyr"+grpId+"-column";
  		return ret;
	}
	
	dimcolumns = dimcolumns.map(v => {
		return {...v, styleCallback: dimStyleCallback};
	})

	meacolumns = meacolumns.map(v => {
		return {...v, styleCallback: meaStyleCallback};
	})

	bucketcolumns = bucketcolumns.map(v => {
		return {...v, styleCallback: bucketStyleCallback};
	})

	//최종 columns
	const dycolumns = [...dimcolumns, ...meacolumns, ...bucketcolumns];
	
	//console.log("dycolumns",dycolumns);
	
	gridInstance.defConfig.columns = dycolumns;
	gridInstance.setDraw(); //그리드를 그린다.

	gridInstance.setDimensionMerge(); //디멘전 셀병합
	
	const layoutOptions = {
		arrBucketType: arrBucketType,
		arrLowBucketType: arrLowBucketType,
		lastBucketType: lastBucketType,
		firstBucketType: firstBucketType,
		bTotal1: defConfig.bTotal1,
		bTotal2: defConfig.bTotal2,
		bTotal3: defConfig.bTotal3,
	};
	gfn_com_getGridLayout(gridInstance, bucketlist, layoutOptions);
}


//2단헤더 이상의 그리드 처리
function gfn_com_getGridLayout(gridInstance, bucketlist, layoutOptions) {
	
	try {
		const gridview = gridInstance.gridview;
		const iBucketTypeLen = layoutOptions.arrBucketType.length;
		const arrLowBucketType = layoutOptions.arrLowBucketType;
		
		//1단헤더
		let blist = bucketlist.filter(v => v.calType === layoutOptions.firstBucketType);
		
		//2단헤더
		if (iBucketTypeLen > 1) {
			blist = blist.map(v => {
				return { 
					...v,
					items: bucketlist.filter(vv => vv.parent === v.uiqcol)
				};
			});
		}
		
		//3단헤더
		if (iBucketTypeLen > 2) {
			blist = blist.map(v => {
				return { 
					...v,
					items : v.items.map(vv => {
						return { 
							...vv,
							items: bucketlist.filter(vvv => vvv.parent === vv.uiqcol)
						};
					})
				};
			});
		}

		//최종적으로 그리드 정보 생성
		//1단 헤더정보
		let layout;
		let headerIdx = 0;
		if (iBucketTypeLen > 1) {
			layout = blist.map(v => {
				return { 
					...v,
					name: v.prefix+v.bucketcol,
					column: v.prefix+v.bucketcol,
					//header: { text: "y"+v.year },
					expandable: true,
					direction: "horizontal",
				};
			})
			
			if (layoutOptions.bTotal1) layout.push({ name: "bucketTotal", column: "bucketTotal" });
			
			headerIdx++;
		}
		
		//2단 헤더정보
		if (iBucketTypeLen > 1) {
			layout = layout.map(v => {
				let items = v.items?.map(vv => {
					return { 
						...vv,
						name: vv.prefix+vv.bucketcol,
						column: vv.prefix+vv.bucketcol,
						//header: { text: "m"+vv.month },
						expandable: true,
						groupShowMode: vv[arrLowBucketType[headerIdx]+"LastNum"] === 1 && !layoutOptions.bTotal2 ? "always" : "expand",
					};
				})
				
				if (layoutOptions.bTotal2) items?.push({ name: v.prefix+v.bucketcol, column: v.prefix+v.bucketcol });
				
				return { 
					...v,
					items: items
				};
			});
			headerIdx++;
		}
		
		//3단 헤더정보
		if (iBucketTypeLen > 2) {
			layout = layout.map(v => { //year
				return { 
					...v,
					items : v.items?.map(vv => { //month
						let items = vv.items?.map(vvv => { //week
							return { 
								...vvv,
								column: vvv.prefix+vvv.bucketcol,
								groupShowMode: vvv[arrLowBucketType[headerIdx]+"LastNum"] === 1 && !layoutOptions.bTotal3 ? "always" : "expand",
							};
						})
						
						if (layoutOptions.bTotal3) items?.push({ name: vv.prefix+vv.bucketcol, column: vv.prefix+vv.bucketcol });
						
						return { 
							...vv,
							items : items
						};
					})
				};
			});
			headerIdx++;
		}
	  	
		//드룹핑되지 않는 컬럼정보 layout 앞뒤로 처리 - 디멘전, 고정컬럼
		if (gridInstance.defConfig.measure) {
			layout = ["measureNm", ...layout];
		}
		
		layout = [...gridInstance.defConfig.dimensions.map(v => v.dimCd), ...layout];
		
	  	//console.log("layout",layout);
	  	gridview.setColumnLayout(layout);
	  	
	} catch(e) {
		console.error("gfn_com_getGridLayout Error!!",e);
	}
}

/**
	그리드 객체 초기화
 */
function gfn_gridsDestroy() {
	try {
		VIEW_GRID_LIST.provider.forEach(v => v.clearRows());
	    VIEW_GRID_LIST.gridview.forEach(v => v.destroy());
	    VIEW_GRID_LIST.provider.forEach(v => v.destroy());
	} catch(e) {}
}

// 엑셀 내보내기 사용하려면 소스에 jszip.min.js 인크루드해야 함
function gfn_exportExcel(grid, options) {
	let exportDef = {
	    type: 'excel',
	    target: 'local',
	    fileName: 'export.xlsx',
	    layoutExpand: "current",
	    indicator: 'hidden',
	    showProgress: true,
	    applyDynamicStyles: true,
	    done: function () {  
	        console.log("done excel export");
	    },
	    exportGrids: [
	      { grid: grid, sheetName: 'Sheet1' }
	    ]
	};
	
	exportDef = {...exportDef, ...options};
	
    grid.exportGrid(exportDef);

};

// 선택된 dataType이 "number"인 셀들의 합계를 반환 한다.
function gfn_getSelectionSummary(objGrid) {
    var sum = 0;
    var cnt = 0;
    var selectData = objGrid.getSelectionData();

    for(var rows in selectData){
      for(var col in selectData[rows]){
        if(objGrid.columnByName(col)?.valueType == "number"){
          sum += selectData[rows][col] ?? 0;
          cnt ++;
        };
      };
    };
    return sum;
}

//그리드 저장 데이터를 리턴
function gfn_getGrdSavedata(objGrid) {
	objGrid.commit();
	var objData = objGrid.getDataSource();
    var jData;
    var jRowsData = [];
    var rows = objData.getAllStateRows();

    rows.deleted.forEach(v => {
        jData = objData.getJsonRow(v);
        jData.state = "deleted";
        jData._rownum = v;
        jRowsData.push(jData);
    });

    rows.updated.forEach(v => {
        jData = objData.getJsonRow(v);
        jData.state = "updated";
        jData._rownum = v;
        jRowsData.push(jData);
    });

    rows.created.forEach(v => {
        jData = objData.getJsonRow(v);
        jData.state = "created";
        jData._rownum = v;
        jRowsData.push(jData);
    });

    if (jRowsData.length === 0) {
        objData.clearRowStates(true);
        return jRowsData;
    }

    return jRowsData;
}

// column Name이 다른 컬럼이어야 한다.
function gfn_setContextMenu(grid) {
    const columns = grid.getColumnNames();
    //const row = grid.getCurrent().itemIndex + 1;
    let visibleContextMenu = [];

    for (let i in columns) {
        let menuItem = {};
        const column = grid.columnByName(columns[i]);
        if (column?.fieldName) {
            menuItem.label = column.header.text;
            menuItem.tag = column.name;
            menuItem.type = "check";
            menuItem.checked = column.visible;

            visibleContextMenu.push(menuItem);
        }
    };

    visibleContextMenu.push(
		{
    		label: "-"
    	},{
            label: "컬럼 모두 보기",
            tag: 'columnShow'
        },{
            label: "-"
        },{
            label: "현재 컬럼 필터 겨기",
            tag: 'autoFilter'
        }
    );
    
    const contextMenu = [
        {
            label: "고정",
            children: [
                {
                    label: "행 1개",
                    tag: '1rowFixed'
                },{
                    label: "행 2개",
                    tag: '2rowFixed'
                },{
                	label: "현재 행까지",
                	tag: 'rowFixed'
                },{
                    label: "-"
                },{
                    label: "첫번째 컬럼",
                    tag: '1colFixed'
                },{
                    label: "두번째 컬럼",
                    tag: '2colFixed'
                },{
                	label: "현재 컬럼까지",
                	tag: 'colFixed'
                },{
                    label: "-"
                },{
	                label: "고정 취소",
	                tag: 'cancelFixed',                    
                	//enabled: (grid.fixedOptions.rightCount + grid.fixedOptions.colCount + grid.fixedOptions.rowCount) != 0
                	enabled: true
                }
        	]
        },{
            label: "컬럼",
            tag: "columnMenu",
            children: visibleContextMenu
        },{
            label: "행 높이",
            children: [
                {
                    label: "보통 (28px)",
                    tag: 'rowNormalHeight'
                },{
                    label: "좁게 (20px)",
                    tag: 'rowSmallHeight'
                },{
                    label: "넓게 (36px)",
                    tag: 'rowLargeHeight'
                }
            ]
        },{
            label: "-" // menu separator를 삽입합니다.
        },{
            label: "ExcelExport",
            tag: 'excelExport'
        }
    ];     
    grid.setContextMenu(contextMenu);
} 

function gfn_contextMenuItemClicked(grid, item, clickData) {
    const col = grid.columnByName(clickData.column);

    // parent에 Tag가 추가되면 switch 문에서 처리하자.
    if (item.parent.label == "컬럼") {
        grid.setColumnProperty(item.tag, "visible", item.checked);
    }

    switch (item.tag){
        case "1rowFixed" : 
            grid.setFixedOptions({rowCount: 1});
            break;
        case "2rowFixed" :
            grid.setFixedOptions({rowCount: 2});            
            break;
        case "rowFixed" :
            grid.setFixedOptions({rowCount: clickData.itemIndex + 1});            
            break;
        case "1colFixed" :
            grid.setFixedOptions({colCount: 1});            
            break;
        case "2colFixed" :
            grid.setFixedOptions({colCount: 2});            
            break;
        case "colFixed" :
            grid.setFixedOptions({colCount: clickData.fieldIndex + 1});            
            break;
        case "cancelFixed" :
            grid.setFixedOptions({colCount: 0, rowCount: 0});            
            break;
        case "rowNormalHeight" :
            grid.displayOptions.rowHeight = 28;
            break;
        case "rowSmallHeight" :
            grid.displayOptions.rowHeight = 20;
            break;
        case "rowLargeHeight" :
            grid.displayOptions.rowHeight = 36;
            break;
        case "excelExport" :
            gfn_exportExcel(grid);
            break;
        case "autoFilter" :
            {
                col.autoFilter = true;
                grid.refresh();
                break;
            }
        case "columnHide" :
            col.visible = false;
            break;
        case "columnShow" :
            {
                const columns = grid.getColumns();
                for (var i in columns) {
                    columns[i].visible = true;
                }
            };
            break;
    }
};