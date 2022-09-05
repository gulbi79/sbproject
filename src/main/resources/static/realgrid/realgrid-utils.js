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
	        sorting : { enabled: true  },
	        sortMode: "explicit",
	        undoable: true,
	        edit    : { insertable: true, appendable: false, updatable: true, editable: true, deletable: true, commitWhenLeave: true},
	        header  : {
	            heightFill: "fixed",
	            showTooltip: true
	        },
	        display : {
		        showEmptyMessage : true,
	        	emptyMessage: "데이터가 없습니다.",
	        }
	    };
	    
	    defaultOptions = {...defaultOptions, ...this.defConfig.options};
	    
		this.gridview.setOptions(defaultOptions);
	    
	    this.gridview.setSortingOptions({
			style: "exclusive" //1.exclusive : 단일정렬, 2.inclusive : 멀티정렬, 3.reverse : 멀티역방향정렬
		});
		
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
	
		this.gridview.setDisplayOptions({
			editItemMerging : true,
			rowHeight : 21,
			//fitStyle : "even",
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
		
		this.provider.setOptions({
			commitBeforeDataEdit: true,
			restoreMode: "auto",
	    	softDeleting: true //삭제시 상태값만 바꾼다.
	    });
	},

    setDraw: function() {
		this.gridview.setColumns(null);
		this.provider.setFields(null);
		
		var fields = [];
		
		//추가 fields
		if (this.defConfig.fields) {
			fields = [...this.defConfig.fields];
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
        }
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

// 페이지 네비게이션 생성 및 이동 처리
// 이 함수는 JQuery가 사용되었습니다.
function paging(totalData, dataPerPage, pageCount, currentPage){
    console.log("currentPage : " + currentPage);

    var totalPage = Math.ceil(totalData/dataPerPage);    // 총 페이지 수
    var pageGroup = Math.ceil(currentPage/pageCount);    // 페이지 그룹

    console.log("pageGroup : " + pageGroup);

    var last = pageGroup * pageCount;    // 화면에 보여질 마지막 페이지 번호
    if(last > totalPage)
        last = totalPage;
    var first = last - (pageCount-1);    // 화면에 보여질 첫번째 페이지 번호
    var next = last+1;
    var prev = first-1;

    console.log("last : " + last);
    console.log("first : " + first);
    console.log("next : " + next);
    console.log("prev : " + prev);

    var $pingingView = $("#paging");

    var html = "";

    if(prev == 0) {
        html += "<a href=# id='first' class='disabled'>|<</a> ";
        html += "<a href=# id='prev' class='disabled'><</a> ";
    } else {
        html += "<a href=# id='first'>|<</a> ";
        html += "<a href=# id='prev'><</a> ";
    }


    for(var i=first; i <= last; i++){
        html += "<a href='#' style='width: 50px' id=" + i + ">" + i + "</a> ";
    }

    if(last < totalPage) {
        html += "<a href=# id='next'>></a>";
        html += "<a href=# id='last'>>|</a>";
    } else {
        html += "<a href=# id='next' class='disabled'>></a>";
        html += "<a href=# id='last' class='disabled'>>|</a>";
    }

    $("#paging").html(html);    // 페이지 목록 생성

    $("#paging a").css({"color": "black",
                        "padding-left": "10px"});

    $("#paging a#" + currentPage).css({"text-decoration":"none",
                                        "color":"red",
                                        "font-weight":"bold"});    // 현재 페이지 표시

    $("#paging a").click(function(){
        var $item = $(this);
        var $id = $item.attr("id");
        var selectedPage = $item.text();


        if($id == "first")   selectedPage = 1;
        if($id == "next")    selectedPage = next;
        if($id == "prev")    selectedPage = prev;
        if($id == "last")    selectedPage = totalPage;

        gridView.setPage(selectedPage-1);
        paging(totalData, dataPerPage, pageCount, selectedPage);
    });

}

// 엑셀 내보내기 실행
// 엑셀 내보내기 사용하려면 소스에 jszip.min.js 인크루드해야 함
function gfn_exportExcel(grid){
    grid.exportGrid({type: 'excel'});

};

// column Name이 다른 컬럼이어야 한다.
function setContextMenu(grid) {
    var columns = grid.getColumnNames();
    var row = grid.getCurrent().itemIndex + 1;

    var visibleContextMenu = [];

    for (var i in columns) {
        var menuItem = {};
        var checked;

        var column = grid.columnByName(columns[i]);

        if (column.fieldName) {
            menuItem.label = column.header.text;
            menuItem.tag = column.name;
            menuItem.checked = column.visible;

            visibleContextMenu.push(menuItem);
        }
    };

    visibleContextMenu.push(
        {
                label: "-"
        },
        {
            label: "컬럼 모두 보기",
            tag: 'columnShow'
        },
        {
            label: "-"
        },
        {
            label: "현재 컬럼 필터 겨기",
            tag: 'autoFilter'
        }
    );

    //var column = grid.columnByName(grid.getCurrent().column);
    var column = grid.columnByName(grid.getCurrent().column);

    var contextMenu = [
        {
            label: "고정",
            children: [
                {
                    label: "행 1개",
                    tag: '1rowFixed'
                },
                {
                    label: "행 2개",
                    tag: '2rowFixed'
                },
                {
                label: "현재 행까지("+ row +")",
                tag: 'rowFixed'
                },
                {
                    label: "-"
                },
                {
                    label: "첫번째 컬럼",
                    tag: '1colFixed'
                },
                {
                    label: "두번째 컬럼",
                    tag: '2colFixed'
                },
                {
                label: "현재 컬럼까지("+ column.header.text +")",
                tag: 'colFixed'
                },
                {
                    label: "-"
                },
                {
                label: "고정 취소",
                tag: 'cancelFixed',
                enabled: (grid.fixedOptions.rightCount + grid.fixedOptions.colCount + grid.fixedOptions.rowCount) != 0
                }]
        },
        {
            label: "컬럼",
            tag: "columnMenu",
            children: visibleContextMenu
        },
        {
            label: "행 높이",
            children: [
                {
                    label: "보통 (28px)",
                    tag: 'rowNormalHeight'
                },
                {
                    label: "좁게 (20px)",
                    tag: 'rowSmallHeight'
                },
                {
                    label: "넓게 (36px)",
                    tag: 'rowLargeHeight'
                }
            ]
        },
        {
            label: "-" // menu separator를 삽입합니다.
        },
        {
            label: "ExcelExport",
            tag: 'excelExport'
        }
    ];
    grid.setContextMenu(contextMenu);
}

function onContextMenuClick(grid, data, index) {
    var cell = grid.getCurrent();
    var col = grid.columnByName(cell.column);

    // data.parent 에 Tag 속성이 없어 switch문 전에 확인한다.
    // parent에 Tag가 추가되면 switch 문에서 처리하자.
    if (data.parent.label == "컬럼") {
        grid.setColumnProperty(data.tag, "visible", !data.checked);
    }

    switch (data.tag){
        case "1rowFixed" :
            grid.setFixedOptions({rowCount: 1});
            break;
        case "2rowFixed" :
            grid.setFixedOptions({rowCount: 2});
            break;
        case "rowFixed" :
            grid.setFixedOptions({rowCount: cell.itemIndex + 1});
            break;
        case "1colFixed" :
            grid.setFixedOptions({colCount: 1});
            break;
        case "2colFixed" :
            grid.setFixedOptions({colCount: 2});
            break;
        case "colFixed" :
            grid.setFixedOptions({colCount: col.index + 1});
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
            exportExcel(grid);
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
                var columns = grid.getColumns();
                for (var i in columns) {
                    columns[i].visible = true;
                }
            };
            break;
    }
};

// 선택된 dataType이 "number"인 셀들의 합계를 반환 한다.
function getSelectionSummary(grid) {
    var sum = 0;
    var cnt = 0;
    var selectData = grid.getSelectionData();

    for(var rows in selectData){
      for(var col in selectData[rows]){
        if(grid.columnByName(col).valueType == "number"){
          sum += selectData[rows][col];
          cnt ++;
        };
      };
    };
    return sum;
}

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

function gfn_drawGridBucket(gridInstance, bucketlist, options) {
	let defConfig = {
		bucketType: "MONTH_WEEK",
	};
	
	defConfig = {...defConfig, ...options};
	
	let rawdata1, rawdata2, rawdata3, rawdata4;
	let rawcol1, rawcol2, rawcol3, rawcol4;
	if (defConfig.bucketType == "MONTH_WEEK") {
		rawdata1 = "WEEK";
		rawcol1 = "week";
	} else if (defConfig.bucketType == "YEAR_MONTH_WEEK") {
		rawdata1 = "WEEK";
		rawcol1 = "week";
	}
	
	
	const gridview = gridInstance.gridview;
	const dycolumns = bucketlist.filter(v => v.calType === rawdata1).map(function(vv) {
		return {name: vv.prefix+vv[rawcol1], type: "data", width: "90", header: {text: vv.prefix+vv[rawcol1]}, styleName: "tar-column" }
	});
	
	//dycolumns 앞뒤로 디멘전, 고정컬럼 처리
	
	gridInstance.defConfig.columns = dycolumns;
	gridInstance.setDraw(); //그리드를 그린다.
	
	//1단헤더
	let blist = bucketlist.filter(v => v.calType === "YEAR");
			
	//2단헤더
	blist = blist.map(v => {
		return { ...v, items: bucketlist.filter(vv => vv.parent === v.uiqcol) };
	});
	
	//3단헤더
	blist = blist.map(v => {
		return { 
			...v, 
			items : v.items.map(vv => {
						return { ...vv, items: bucketlist.filter(vvv => vvv.parent === vv.uiqcol) };
					})
		};
	});
	
	//최종적으로 그리드 정보 생성
	const layout = blist.map(v => {
		return {
			...v, 
			name: "y"+v.year,
			column: "y"+v.year,
			expandable: true,
			direction: "horizontal",
			
			//2단헤더 그리드정보
			items : v.items.map(vv => {
						return { 
							...vv,
							name: "m"+vv.month,
							column: "m"+vv.month,
							expandable: true,
							//groupShowMode: vv.monthLastNum === 1 ? "always" : "expand",
							
							//3단헤더 그리드정보
							items: vv.items.map(vvv => {
								return { 
									...vvv,
									column: "w"+vvv.week,
									//expandable: true,
									groupShowMode: vvv.weekLastNum === 1 ? "always" : "expand",
								};
							})
						};
					})
		};
	});
  		
  	
  	console.log("layout",layout);
  	gridview.setColumnLayout(layout);
	
	/*
	//실제 layout 구성
	const layout = blist.map(function(v) {
		return {
			name: "m"+v.fullMonth,
		    expandable: true,
		    direction: "horizontal",
		    items: v.items.map(function(vv) {
				return {column: "w"+vv.yearweek, groupShowMode: vv.monthLastNum === 1 ? "always" : "expand"};
			}),
		    header: {
		      text: "m"+v.fullMonth,
		    }
		};
	});
	*/
	
	//드룹핑되지 않는 컬럼정보 layout 앞뒤로 처리 - 디멘전, 고정컬럼
	//gridview.setColumnLayout(layout);
}