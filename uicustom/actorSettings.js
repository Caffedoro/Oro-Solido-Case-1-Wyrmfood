
function syncFormInputsActorSettings() {

    $('#actorLimit').val(config.actorLimit || '');

    $('#actorWindowWidth').val(config.actorWindowWidth || '');
    $('#actorWindowHeight').val(config.actorWindowHeight || '');

    $('#actorWindowBackgroundType').val(config.actorWindowBackgroundType || 'window');
    $('#actorWindowBackgroundFileBox').toggle(config.actorWindowBackgroundType == 'image');
    $('#actorWindowOpacity').val(config.actorWindowOpacity || '');

    updateActorFormationTable();

    updateActorElementsTable();
}

function updateActorFormationTable() {
    config.actorFormation = config.actorFormation || [ ];

    const n = config.actorLimit || 4;
    
    const xOffset = (index) => $('<div></div>')
        .css('width', '5rem')
        .append($('<input>')
            .addClass('form-control')
            .attr('type', 'number')
            .val(config.actorFormation[index] && typeof config.actorFormation[index].x == 'number'
                ? config.actorFormation[index].x
                : 0
            )
            .on('change', (event) => {
                config.actorFormation[index] = config.actorFormation[index] || { };
                config.actorFormation[index].x = toNumber($(event.target).val());

                onSave();
            }));

    const yOffset = (index) => $('<div></div>')
        .css('width', '5rem')
        .append($('<input>')
            .addClass('form-control')
            .attr('type', 'number')
            .val(config.actorFormation[index] && typeof config.actorFormation[index].y == 'number'
                ? config.actorFormation[index].y
                : 0
            )
            .on('change', (event) => {
                config.actorFormation[index] = config.actorFormation[index] || { };
                config.actorFormation[index].y = toNumber($(event.target).val());

                onSave();
            }));
        
    updateSortableTable(
        $('#actorFormationTableHead'),
        $('#actorFormationTableBody'),
        ['#', 'X', 'Y'],
        range(n).map((_, i) => i + 1),
        [
            (_, index) => $('<td></td>').text(index + 1),
            (_, index) => $('<td></td>').append(xOffset(index)),
            (_, index) => $('<td></td>').append(yOffset(index)),
        ],
        "-",
    );
}

let currentActorElementIndex = -1;

const actorElementDefault = () => ({
    type:               'name',
    hpMpTpSubType:      'hp',
    parameterFamily:    'primary',
    portrait:           'face',
});

function onCreateActorElement() {
    config.actorElements = config.actorElements || [ ];
    config.actorElements.push(actorElementDefault());

    updateActorElementsTable();
    openEditActorElementModal(config.actorElements.length - 1);
    onSave();
}

function openEditActorElementModal(index) {
    currentActorElementIndex = index;

    const actorElement = config.actorElements[index];

    $('#actorElementType').val(actorElement.type);
    $('#hpMpTpSubType').val(actorElement.hpMpTpSubType);
    $('#parameterFamily').val(actorElement.parameterFamily);
    $('#baseParameter').val(String(actorElement.baseParameter || 0));
    $('#xParameter').val(String(actorElement.xParameter || 0));
    $('#sParameter').val(String(actorElement.sParameter || 0));
    
    toggle9DirButtons('#actorElementPosition9Dir', actorElement.position9Dir || 'topLeft');
    $('#actorElementX').val(String(actorElement.x || 0));
    $('#actorElementY').val(String(actorElement.y || 0));
    $('#actorElementWidth').val(actorElement.width || '');
    $('#actorElementHeight').val(actorElement.height || '');
    $('#actorElementScale').val(actorElement.scale || '');

    $('#actorElementText').val(actorElement.text || '');

    $('#actorElementPortrait').val(actorElement.portrait || 'face');

    $('#actorElementGaugeLabel').val(actorElement.gaugeLabel || '');
    $('#actorElementGaugeCurrentEval').val(actorElement.gaugeCurrentEval || '');
    $('#actorElementGaugeMaxEval').val(actorElement.gaugeMaxEval || '');

    $('#actorElementCustomEval').val(actorElement.customEval || '');
    
    $('#actorElementFontSize').val(actorElement.fontSize || '');
    toggleButtons(
        '#actorElementTextAlign',
        ['left', 'center', 'right'],
        actorElement.textAlign || 'left'
    );

    updateActorElementsTypes();

    $('#addActorElementModal').modal('show');
}

function updateActorElementsTable() {
    updateSortableTable(
        $('#actorElementsTableHead'),
        $('#actorElementsTableBody'),
        ['#', 'Type'],
        config.actorElements || [ ],
        [
            (actorElement, index) => $('<td></td>').text(index + 1),
            (actorElement, index) => $('<td></td>').text(makeActorElementTypeText(actorElement)),
        ],
        "Click 'Add Actor Element' to add a new actor element.",
        {
            toggleVisibility:   toggleActorElementVisibility,
            isVisible:          (index) => !config.actorElements[index].hidden,
            moveUpAction:       moveActorElementUp,
            moveDownAction:     moveActorElementDown,
            editAction:         openEditActorElementModal,
            duplicateAction:    duplicateActorElement,
            deleteAction:       openDeleteActorElementModal,
        }
    );
}

function makeActorElementTypeText(actorElement) {
    if (!actorElement) return '';

    if (actorElement.type == 'hpMpTp') {
        switch (actorElement.hpMpTpSubType) {
            case 'hp':  return 'HP';
            case 'mp':  return 'MP';
            case 'tp':  return 'TP';
            default:    return '?';
        }
    }
    if (actorElement.type == 'actorParams') {
        if (!actorElement.parameterFamily || actorElement.parameterFamily == 'primary') {
            switch (actorElement.baseParameter || 0) {
                case 0: return 'Max HP';
                case 1: return 'Max MP';
                case 2: return 'ATK';
                case 3: return 'DEF';
                case 4: return 'MAT';
                case 5: return 'MDF';
                case 6: return 'AGI';
                case 7: return 'LUK';
                default: return '?';
            }
        } else {
            return 'Param';
        }
    }

    switch (actorElement.type) {
        case 'name':        return 'Name';
        case 'classname':   return 'Class Name';
        case 'picture':     return 'Picture';
        case 'portrait':    return 'Portrait';
        case 'states':      return 'States';
        case 'exp':         return 'Level & Exp';
        case 'text':        return 'Text';
        case 'window':      return 'Window';
        case 'script':      return 'Script';
        case 'customGauge': return 'Custom Gauge';
        default:            return actorElement.type;
    }
}

function toggleActorElementVisibility(index) {
    const actorElement = config.actorElements[index];
    
    if (actorElement) {
        actorElement.hidden = !actorElement.hidden;
        
        updateActorElementsTable();
        onSave();
    }
}

function moveActorElementUp(index) {
    if (index > 0) {
        const temp = config.actorElements[index - 1];
        config.actorElements[index - 1] = config.actorElements[index];
        config.actorElements[index] = temp;

        updateActorElementsTable();
        onSave();
    }
}

function moveActorElementDown(index) {
    if (index < config.actorElements.length - 1) {
        const temp = config.actorElements[index + 1];
        config.actorElements[index + 1] = config.actorElements[index];
        config.actorElements[index] = temp;

        updateActorElementsTable();
        onSave();
    }
}

function duplicateActorElement(index) {
    const duplicated = JSON.parse(JSON.stringify(config.actorElements[index]));
    config.actorElements.splice(index + 1, 0, duplicated);

    updateActorElementsTable();
    onSave();
}

function openDeleteActorElementModal(index) {
    currentActorElementIndex = index;

    $('#deleteActorElementModal').modal('show');
}

function confirmDeleteActorElement() {
    const actorElement = config.actorElements[currentActorElementIndex];

    if (actorElement) {
        config.actorElements.splice(currentActorElementIndex, 1);
        currentActorElementIndex = -1;

        updateActorElementsTable();
        onSave();
    }
}

function changeActorElementType(value) {
    changeActorElementProperty('type', value);

    updateActorElementsTypes();
}

function changeActorParameterFamily(value) {
    changeActorElementProperty('parameterFamily', value);

    updateActorElementsTypes();
}

function updateActorElementsTypes() {
    const currentActorElement = config.actorElements ? config.actorElements[currentActorElementIndex] : null;
    
    if (currentActorElement) {
        $('#hpMpTpSubTypeBox').toggle(currentActorElement.type == 'hpMpTp');
        $('#parameterFamilyBox').toggle(currentActorElement.type == 'actorParams');
        $('#baseParameterBox').toggle(currentActorElement.type == 'actorParams' && currentActorElement.parameterFamily == 'primary');
        $('#xParameterBox').toggle(currentActorElement.type == 'actorParams' && currentActorElement.parameterFamily == 'xParam');
        $('#sParameterBox').toggle(currentActorElement.type == 'actorParams' && currentActorElement.parameterFamily == 'sParam');

        $('#actorElementWidthBox').toggle([
            'name',
            'nickname',
            'classname',
            'hpMpTp',
            'exp',
            'actorParams',
            'text',
            'window',
            'script',
        ].includes(currentActorElement.type));
        
        $('#actorElementHeightBox').toggle([
            'name',
            'nickname',
            'classname',
            'actorParams',
            'text',
            'window',
            'script',
        ].includes(currentActorElement.type));

        $('#actorElementTextBox').toggle(currentActorElement.type == 'text');
        $('#actorElementPortraitBox').toggle(currentActorElement.type == 'portrait');
        $('#actorElementGaugeSettingsBox').toggle(currentActorElement.type == 'exp' || currentActorElement.type == 'customGauge');
        $('#actorElementCustomGaugeBox').toggle(currentActorElement.type == 'customGauge');
        $('#actorElementGaugeLabelColorBox').toggle(currentActorElement.type == 'customGauge');

        $('#actorElementCustomEvalBox').toggle(currentActorElement.type == 'script');

        $('#actorElementFontSizeBox').toggle(
            currentActorElement.type == 'name' ||
            currentActorElement.type == 'nickname' ||
            currentActorElement.type == 'classname' ||
            currentActorElement.type == 'actorParams' ||
            currentActorElement.type == 'text' ||
            currentActorElement.type == 'script'
        );
        $('#actorElementTextColorBox').toggle(
            currentActorElement.type == 'name' ||
            currentActorElement.type == 'nickname' ||
            currentActorElement.type == 'classname' ||
            currentActorElement.type == 'actorParams' ||
            currentActorElement.type == 'text' ||
            currentActorElement.type == 'script'
        );
        $('#actorElementTextAlignBox').toggle(
            currentActorElement.type == 'name' ||
            currentActorElement.type == 'nickname' ||
            currentActorElement.type == 'classname' ||
            currentActorElement.type == 'actorParams' ||
            currentActorElement.type == 'text' ||
            currentActorElement.type == 'script'
        );

        $('#actorElementPictureBox').toggle(currentActorElement.type == 'picture');
        $('#actorElementScaleBox').toggle(
            currentActorElement.type == 'portrait' ||
            currentActorElement.type == 'picture' ||
            currentActorElement.type == 'states'
        );
        $('#actorElementStatesBox').toggle(currentActorElement.type == 'states');

        $('#actorElementRequireSwitch').prop('checked', !!currentActorElement.requireSwitch);
        $('#actorElementRequireVariable').prop('checked', !!currentActorElement.requireVariable);
        $('#actorElementRequireClass').prop('checked', !!currentActorElement.requireClass);
        $('#actorElementRequireVitalStatus').prop('checked', !!currentActorElement.requireVitalStatus);
        $('#actorElementRequireNotetag').prop('checked', !!currentActorElement.requireNotetag);
        $('#actorElementRequireScript').prop('checked', !!currentActorElement.requireScript);

        $('#actorElementRequiredSwitchBox').toggle(!!currentActorElement.requireSwitch);
        $('#actorElementRequiredVariableBox').toggle(!!currentActorElement.requireVariable);
        $('#actorElementRequiredClassBox').toggle(!!currentActorElement.requireClass);
        $('#actorElementRequiredVitalStatusBox').toggle(!!currentActorElement.requireVitalStatus);
        $('#actorElementRequiredNotetagBox').toggle(!!currentActorElement.requireNotetag);
        $('#actorElementRequiredScriptBox').toggle(!!currentActorElement.requireScript);

        $('#actorElementRequiredSwitchId').val(currentActorElement.requiredSwitchId || '');
        $('#actorElementRequiredSwitchValue').val(currentActorElement.requiredSwitchValue || 'on');

        $('#actorElementRequiredVariableId').val(currentActorElement.requiredVariableId || '');
        $('#actorElementRequiredVariableOperator').val(currentActorElement.requiredVariableOperator || 'greaterThanOrEqual');
        $('#actorElementRequiredVariableValue').val(currentActorElement.requiredVariableValue || '');

        $('#actorElementRequiredClassId').val(currentActorElement.requiredClassId || '1');

        $('#actorElementRequiredVitalStatus').val(currentActorElement.requiredVitalStatus || 'alive');
        
        $('#actorElementRequiredNotetagMode').val(currentActorElement.requiredNotetagMode || 'mustHave');
        $('#actorElementRequiredNotetag').val(currentActorElement.requiredNotetag || '');

        $('#actorElementRequiredScript').val(currentActorElement.requiredScript || '');
    }
}

function changeActorElementRequireSwitch(checked) {
    changeActorElementProperty('requireSwitch', checked);
}

function changeActorElementRequireVariable(checked) {
    changeActorElementProperty('requireVariable', checked);
}

function changeActorElementRequireClass(checked) {
    changeActorElementProperty('requireClass', checked);
}

function changeActorElementRequireVitalStatus(checked) {
    changeActorElementProperty('requireVitalStatus', checked);
}

function changeActorElementRequireNotetag(checked) {
    changeActorElementProperty('requireNotetag', checked);
}

function changeActorElementRequireScript(checked) {
    changeActorElementProperty('requireScript', checked);
}

function changeActorElementNumber(property, value) {
    changeActorElementProperty(property, toNumber(value));
}

function changeActorElementFile(property, file) {
    changeActorElementProperty(property, userFileToLocalFile('img', file));
}

function changeActorElementPosition9Dir(value) {
    changeActorElementProperty('position9Dir', value);
}

function changeActorElementTextColor(value) {
    changeActorElementNumber('textColor', value);
}

function changeActorElementGaugeLabelColor(value) {
    changeActorElementProperty('gaugeLabelColor', value);
}

function changeActorElementGaugeValueColor(value) {
    changeActorElementProperty('gaugeValueColor', value);
}

function changeActorElementGaugeColor1(value) {
    changeActorElementProperty('gaugeColor1', value);
}

function changeActorElementGaugeColor2(value) {
    changeActorElementProperty('gaugeColor2', value);
}

function changeActorElementGaugeColorWhenMaxed1(value) {
    changeActorElementProperty('gaugeColorWhenMaxed1', value);
}

function changeActorElementGaugeColorWhenMaxed2(value) {
    changeActorElementProperty('gaugeColorWhenMaxed2', value);
}

function changeActorElementTextAlign(value) {
    changeActorElementProperty('textAlign', value);

    toggleButtons(
        '#actorElementTextAlign',
        ['left', 'center', 'right'],
        value
    );
}


function changeActorElementProperty(property, value) {
    const currentActorElement = config.actorElements ? config.actorElements[currentActorElementIndex] : null;
    
    if (currentActorElement) {
        currentActorElement[property] = value;
        
        updateActorElementsTable();
        onSave();
    }
}


// Highlight
if (window.opener) {
    setInterval(() => {
        $('#addActorElementModal').hasClass('show')
            ? window.opener.UICustom.highlightActorElement(currentActorElementIndex)
            : window.opener.UICustom.clearHighlight();
    }, 100);
}


$(document).ready(() => {
    const dummyClasses = [
        { id: 1, name: "Warrior" },
        { id: 2, name: "Mage" },
        { id: 3, name: "Thief" }
    ];

    const gameClasses = window.opener ? window.opener.$dataClasses : dummyClasses; 

    $('.gameclass-select')
        .empty()
        .append(gameClasses
            .filter(gameClass => gameClass && gameClass.name)
            .map(gameClass => $('<option></option>')
                .val(gameClass.id)
                .text(gameClass.name)
    ));
});
