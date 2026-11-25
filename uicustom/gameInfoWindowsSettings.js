
function gameInfoWindowDefault() {
    return {
        position9Dir: 'bottomLeft',
        twoColumns: true,
    };
}

function syncFormInputsGameInfoWindows() {
    updateGameInfoWindowsTable();
}

function onCreateGameInfoWindow() {
    config.gameInfoWindows = config.gameInfoWindows || [ ];

    const newGameInfoWindow = gameInfoWindowDefault();
    newGameInfoWindow.name = 'Window #' + (config.gameInfoWindows.length + 1);

    config.gameInfoWindows.push(newGameInfoWindow);

    updateGameInfoWindowsTable();
    openEditGameInfoWindowModal(config.gameInfoWindows.length - 1);
    onSave();
}

let currentGameInfoWindowIndex = -1;

function updateGameInfoWindowsTable() {
    updateSortableTable(
        $('#gameInfoWindowsTableHead'),
        $('#gameInfoWindowsTableBody'),
        ['#', 'Name'],
        config.gameInfoWindows || [ ],
        [
            (gameInfoWindow, index) => $('<td></td>').text(index + 1),
            (gameInfoWindow, index) => $('<td></td>').text(gameInfoWindow.name || '?'),
        ],
        "Click 'Add Game Info Window' to add a new game info window.",
        {
            toggleVisibility:   toggleGameInfoWindowVisibility,
            isVisible:          (index) => !config.gameInfoWindows[index].hidden,
            moveUpAction:       moveGameInfoWindowUp,
            moveDownAction:     moveGameInfoWindowDown,
            editAction:         openEditGameInfoWindowModal,
            duplicateAction:    duplicateGameInfoWindow,
            deleteAction:       openDeleteGameInfoWindowModal,
        }
    );
}

function toggleGameInfoWindowVisibility(index) {
    config.gameInfoWindows[index].hidden = !config.gameInfoWindows[index].hidden;
    updateGameInfoWindowsTable();
}

function moveGameInfoWindowUp(index) {
    if (index > 0) {
        const temp = config.gameInfoWindows[index - 1];
        config.gameInfoWindows[index - 1] = config.gameInfoWindows[index];
        config.gameInfoWindows[index] = temp;

        updateGameInfoWindowsTable();
        onSave();
    }
}

function moveGameInfoWindowDown(index) {
    if (index < config.gameInfoWindows.length - 1) {
        const temp = config.gameInfoWindows[index + 1];
        config.gameInfoWindows[index + 1] = config.gameInfoWindows[index];
        config.gameInfoWindows[index] = temp;

        updateGameInfoWindowsTable();
        onSave();
    }
}

function duplicateGameInfoWindow(index) {
    const duplicated = JSON.parse(JSON.stringify(config.gameInfoWindows[index]));
    config.gameInfoWindows.splice(index + 1, 0, duplicated);

    updateGameInfoWindowsTable();
    onSave();
}

function openDeleteGameInfoWindowModal(index) {
    currentGameInfoWindowIndex = index;

    $('#deleteGameInfoWindowModal').modal('show');
}

function confirmDeleteGameInfoWindow() {
    const gameInfoWindow = config.gameInfoWindows[currentGameInfoWindowIndex];

    if (gameInfoWindow) {
        config.gameInfoWindows.splice(currentGameInfoWindowIndex, 1);
        currentGameInfoWindowIndex = -1;

        updateGameInfoWindowsTable();
        onSave();
    }
}

function openEditGameInfoWindowModal(index) {
    currentGameInfoWindowIndex = index;

    const gameInfoWindow = config.gameInfoWindows[index];

    $('#gameInfoWindowName').val(gameInfoWindow.name || '');

    // Position and Size
    toggle9DirButtons('#gameInfoWindowPosition9Dir', gameInfoWindow.position9Dir || 'topLeft');
    updateGameInfoWindowWidthModeButtons();

    $('#gameInfoWindowX').val(gameInfoWindow.x || '');
    $('#gameInfoWindowY').val(gameInfoWindow.y || '');
    $('#gameInfoWindowWidth').val(gameInfoWindow.width || '');
    $('#gameInfoWindowWidthByPercentage').val(gameInfoWindow.widthByPercentage || '');
    $('#gameInfoWindowHeight').val(gameInfoWindow.height || '');

    // Properties
    $('#gameInfoWindowOpacity').val(gameInfoWindow.opacity || '');
    $('#gameInfoWindowPadding').val(gameInfoWindow.padding || '');
    $('#gameInfoWindowLineHeight').val(gameInfoWindow.lineHeight || '');
    $('#gameInfoWindowFontSize').val(gameInfoWindow.fontSize || '');

    $('#gameInfoWindowBackgroundType').val(gameInfoWindow.backgroundType || 'window');
    $('#gameInfoWindowBackgroundImageBox').toggle(gameInfoWindow.backgroundType == 'image');

    // Content
    $('#gameInfoWindow2ColumnsSwitch').prop('checked', !!gameInfoWindow.twoColumns);
    $('#gameInfoTextRightBox').toggle(!!gameInfoWindow.twoColumns);
    $('#gameInfoTextLeft').val(gameInfoWindow.textLeft || '');
    $('#gameInfoTextRight').val(gameInfoWindow.textRight || '');

    // Conditions
    $('#gameInfoWindowRequireSwitch').prop('checked', !!gameInfoWindow.requireSwitch);
    $('#gameInfoWindowRequireVariable').prop('checked', !!gameInfoWindow.requireVariable);
    $('#gameInfoWindowRequireScript').prop('checked', !!gameInfoWindow.requireScript);

    $('#gameInfoWindowRequiredSwitchBox').toggle(!!gameInfoWindow.requireSwitch);
    $('#gameInfoWindowRequiredVariableBox').toggle(!!gameInfoWindow.requireVariable);
    $('#gameInfoWindowRequiredScriptBox').toggle(!!gameInfoWindow.requireScript);

    $('#gameInfoWindowRequiredSwitchId').val(gameInfoWindow.requiredSwitchId || '');
    $('#gameInfoWindowRequiredSwitchValue').val(gameInfoWindow.requiredSwitchValue || 'on');

    $('#gameInfoWindowRequiredVariableId').val(gameInfoWindow.requiredVariableId || '');
    $('#gameInfoWindowRequiredVariableOperator').val(gameInfoWindow.requiredVariableOperator || 'greaterThanOrEqual');
    $('#gameInfoWindowRequiredVariableValue').val(gameInfoWindow.requiredVariableValue || '');

    $('#gameInfoWindowRequiredScript').val(gameInfoWindow.requiredScript || '');

    // Open Modal
    $('#addGameInfoWindowModal').modal('show');
}

function changeGameInfoWindowPosition9Dir(value) {
    changeGameInfoWindowProperty('position9Dir', value);
}

function changeGameInfoWindowWidthMode(mode) {
    changeGameInfoWindowProperty('widthMode', mode);
    
    updateGameInfoWindowWidthModeButtons();
}

function updateGameInfoWindowWidthModeButtons() {
    const currentGameInfoWindow = config.gameInfoWindows ? config.gameInfoWindows[currentGameInfoWindowIndex] : null;
    if (!currentGameInfoWindow) return;

    const mode = currentGameInfoWindow.widthMode || 'fixed';

    toggleButtons('#gameInfoWindowWidthMode', ['fixed', 'percentage'], mode);
    $('#gameInfoWindowWidthFixedBox').toggle(mode == 'fixed');
    $('#gameInfoWindowWidthPercentageBox').toggle(mode == 'percentage');
}

function changeGameInfoWindowBackgroundType(value) {
    $('#gameInfoWindowBackgroundImageBox').toggle(value == 'image');

    changeGameInfoWindowProperty('backgroundType', value);
}

function changeGameInfoWindow2Columns(checked) {
    $('#gameInfoTextRightBox').toggle(checked);
    
    changeGameInfoWindowProperty('twoColumns', checked);
}

function changeGameInfoWindowNumber(property, value) {
    changeGameInfoWindowProperty(property, toNumber(value));
}

function changeGameInfoWindowRequireSwitch(checked) {
    changeGameInfoWindowProperty('requireSwitch', checked);
}

function changeGameInfoWindowRequireVariable(checked) {
    changeGameInfoWindowProperty('requireVariable', checked);
}

function changeGameInfoWindowRequireScript(checked) {
    changeGameInfoWindowProperty('requireScript', checked);
}

function changeGameInfoWindowProperty(property, value) {
    const currentGameInfoWindow = config.gameInfoWindows ? config.gameInfoWindows[currentGameInfoWindowIndex] : null;

    if (currentGameInfoWindow) {
        currentGameInfoWindow[property] = value;
        
        updateGameInfoWindowsTable();
        onSave();
    }
}
