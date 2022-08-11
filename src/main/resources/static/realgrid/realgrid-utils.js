/**
 * RealGrid2 Utility
 * 리얼그리드 활용 방법에 대한 예제로 만들어진 함수들 입니다.
 * realgrid-utils 함수들에 대한 기술 지원은 따로 하지 않습니다.
 * 소스 수정 및 배포등 자유롭게 사용하시기 바랍니다.
 */


var GRID = function() {
    this.gridview;
    this.provider;
    this.realgridConfig = {
        gridId : "realgrid",
        fields : null,
        columns : null,
    };
};

GRID.prototype = {
    init: function(options) {
        this.setConfig(options);
        this.provider = new RealGrid.LocalDataProvider();
        this.gridview = new RealGrid.GridView(this.realgridConfig.gridId);
        this.gridview.setDataSource(this.provider);
        this.setColumn();
        return this;
    },
    treeInit: function(options) {
        this.setConfig(options);
        this.provider = new RealGrid.LocalTreeDataProvider();
        this.gridview = new RealGrid.TreeView(this.realgridConfig.gridId);
        this.gridview.setDataSource(this.provider);
        this.setColumn();
        this.setOptions();
        return this;
    },

    setConfig: function(options) {
        this.realgridConfig = {...this.realgridConfig, ...options};
    },

    setColumn: function() {
		var fields = [];
		
		//추가 fields
		if (this.realgridConfig.fields) {
			fields = [...this.realgridConfig.fields];
		}
		
        if (this.realgridConfig.columns) {
            this.realgridConfig.columns = this.realgridConfig.columns.map(function(v) {
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
            console.log(this.realgridConfig.columns);
            this.gridview.setColumns(this.realgridConfig.columns);
        }
    },
    
    setOptions : function() {
		let defaultOptions = {
	        panel	: { visible: false },
	        footer	: { visible: false },
	        checkBar: { visible: false },
	        stateBar: { visible: false },
	        sorting : { enabled: true  },
	        sortMode: "explicit",
	        edit    : { insertable: true, appendable: false, updatable: true, editable: true, deletable: true},
	        header  : {
	            heightFill: "fixed",
	            showTooltip: true
	        },
	        display : {
	        	emptyMessage: "",
	        }
	    };
	    
	    defaultOptions = {...defaultOptions, ...this.realgridConfig.options};
	    
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
	}
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
function exportExcel(grid){
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

