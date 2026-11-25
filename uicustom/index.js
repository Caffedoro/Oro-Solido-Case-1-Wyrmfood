
const CONFIG_NAME   = 'config_v3.json';
const pluginVersion = Imported ? Imported.MK_UICustomizer : '3.0.0';
const getTemplate   = window.opener ? window.opener.UICustom.getDefaultConfig : () => ({ });


const layoutQuickTemplates = [
    [ 'rowsCommandLeft',        'Rows, Command on Left'     ],
    [ 'rowsCommandRight',       'Rows, Command on Right'    ],
    [ 'columns',                'Columns'],
];

const actorContentQuickTemplates = [
    [ 'default',    'Default'   ],
    [ 'columns',    'Columns'   ],
    [ 'retro',      'Retro'     ],
];

const gameInfoWindowsQuickTemplates = [
    [ 'defaultBottomLeft',      'Default Bottom Left'   ],
    [ 'defaultBottomRight',     'Default Bottom Right'  ],
    [ 'bottomHorizontal',       'Bottom Horizontal'     ],
];

$(document).ready(() => {
    $('#layoutQuickTemplates')
        .empty()
        .append(
            layoutQuickTemplates.map(([value, text]) => $('<option>').val(value).text(text))
        );

    $('#actorContentQuickTemplates')
        .empty()
        .append(
            actorContentQuickTemplates.map(([value, text]) => $('<option>').val(value).text(text))
        );
    
    $('#gameInfoWindowsQuickTemplates')
        .empty()
        .append(
            gameInfoWindowsQuickTemplates.map(([value, text]) => $('<option>').val(value).text(text))
        );
});

function applyLayoutQuickTemplate() {
    const template = $('#layoutQuickTemplates').val();

    if (!config.actorLimit) {
        config.actorLimit = 4;
    }

    const actorLimit    = config.actorLimit;
    const scene         = window.opener ? window.opener.SceneManager._scene : null;
    const boxWidth      = scene ? scene.mainAreaWidth() : 1024;
    const boxHeight     = scene ? scene.mainAreaHeight() : 768;

    config.commandPosition = template.toLowerCase().includes('left') ? 'topLeft' : 'topRight';
    config.commandOffsetX = 0;
    config.commandOffsetY = 0;
    
    if (template == 'rowsCommandLeft' || template == 'rowsCommandRight') {
        config.commandWindowOrientation     = 'vertical';
        config.commandWidth                 = config.commandWidth || 240;
        config.actorWindowWidth             = boxWidth - config.commandWidth;
        config.actorWindowHeight            = Math.floor(boxHeight / actorLimit);

        config.actorFormation = range(actorLimit)
            .map(index => ({
                x: template == 'rowsCommandLeft' ? config.commandWidth : 0,
                y: config.actorWindowHeight * index,
            }));
    }
    if (template == 'columns') {
        const defaultWindowHeight = scene ? scene.calcWindowHeight(1, true) : 68;

        config.commandWindowOrientation = 'horizontal';
        config.commandWidth             = undefined;
        config.actorWindowWidth         = Math.floor(boxWidth / actorLimit);
        config.actorWindowHeight        = boxHeight - 2 * defaultWindowHeight;

        config.actorFormation = range(actorLimit)
            .map(index => ({
                x: config.actorWindowWidth * index,
                y: defaultWindowHeight,
            }));
    }

    syncFormInputs();
    onSave();
}

function applyActorContentQuickTemplate() {
    const template = $('#actorContentQuickTemplates').val();

    if (template == 'default') {
        config.actorElements = [
            {
                "type": "portrait",
                "hpMpTpSubType": "hp",
                "parameterFamily": "primary",
                "portrait": "face",
                "position9Dir": "middleLeft",
                "scale": 90,
                "x": 6
            },
            {
                "type": "name",
                "hpMpTpSubType": "hp",
                "parameterFamily": "primary",
                "portrait": "face",
                "x": 160,
                "width": 200,
                "fontSize": 30,
                "textColor": 6,
                "y": 8
            },
            {
                "type": "classname",
                "hpMpTpSubType": "hp",
                "parameterFamily": "primary",
                "portrait": "face",
                "width": 200,
                "textColor": 16,
                "y": 8,
                "position9Dir": "topRight",
                "textAlign": "right",
                "x": -6
            },
            {
                "type": "hpMpTp",
                "hpMpTpSubType": "hp",
                "parameterFamily": "primary",
                "portrait": "face",
                "position9Dir": "bottomLeft",
                "y": -30,
                "x": 160,
                "width": 300
            },
            {
                "type": "hpMpTp",
                "hpMpTpSubType": "mp",
                "parameterFamily": "primary",
                "portrait": "face",
                "position9Dir": "bottomLeft",
                "x": 180,
                "width": 300
            },
            {
                "type": "exp",
                "hpMpTpSubType": "hp",
                "parameterFamily": "primary",
                "portrait": "face",
                "position9Dir": "bottomRight",
                "gaugeLabel": "Lv",
                "hidden": false,
                "x": -6,
                "width": 200
            }
        ]
    }

    if (template == 'columns') {
        config.actorElements = [
            {
                "type": "portrait",
                "hpMpTpSubType": "hp",
                "parameterFamily": "primary",
                "portrait": "face",
                "position9Dir": "middleCenter",
                "scale": 120,
                "y": -20
            },
            {
                "type": "name",
                "hpMpTpSubType": "hp",
                "parameterFamily": "primary",
                "portrait": "face",
                "width": 200,
                "fontSize": 40,
                "textColor": 6,
                "y": 20,
                "position9Dir": "topCenter",
                "textAlign": "center"
            },
            {
                "type": "classname",
                "hpMpTpSubType": "hp",
                "parameterFamily": "primary",
                "portrait": "face",
                "width": 200,
                "textColor": 16,
                "y": 70,
                "position9Dir": "topCenter",
                "textAlign": "center"
            },
            {
                "type": "hpMpTp",
                "hpMpTpSubType": "hp",
                "parameterFamily": "primary",
                "portrait": "face",
                "position9Dir": "bottomCenter",
                "y": -30
            },
            {
                "type": "hpMpTp",
                "hpMpTpSubType": "mp",
                "parameterFamily": "primary",
                "portrait": "face",
                "position9Dir": "bottomCenter"
            },
            {
                "type": "exp",
                "hpMpTpSubType": "hp",
                "parameterFamily": "primary",
                "portrait": "face",
                "position9Dir": "bottomCenter",
                "gaugeLabel": "Lv",
                "hidden": false,
                "y": -100
            }
        ]
    }

    if (template == 'retro') {
        config.actorElements = [
            {
                "type": "portrait",
                "hpMpTpSubType": "hp",
                "parameterFamily": "primary",
                "portrait": "battler",
                "position9Dir": "middleLeft",
                "scale": 200,
                "x": 6
            },
            {
                "type": "name",
                "hpMpTpSubType": "hp",
                "parameterFamily": "primary",
                "portrait": "face",
                "x": 160,
                "width": 200,
                "fontSize": 30,
                "textColor": 6,
                "y": 8
            },
            {
                "type": "classname",
                "hpMpTpSubType": "hp",
                "parameterFamily": "primary",
                "portrait": "face",
                "width": 200,
                "textColor": 16,
                "y": 8,
                "position9Dir": "topRight",
                "textAlign": "right",
                "x": -6
            },
            {
                "type": "hpMpTp",
                "hpMpTpSubType": "hp",
                "parameterFamily": "primary",
                "portrait": "face",
                "position9Dir": "bottomLeft",
                "y": -40,
                "x": 160,
                "width": 300
            },
            {
                "type": "hpMpTp",
                "hpMpTpSubType": "mp",
                "parameterFamily": "primary",
                "portrait": "face",
                "position9Dir": "bottomLeft",
                "x": 160,
                "width": 300
            },
            {
                "type": "exp",
                "hpMpTpSubType": "hp",
                "parameterFamily": "primary",
                "portrait": "face",
                "position9Dir": "bottomRight",
                "gaugeLabel": "Lv",
                "hidden": false,
                "x": -6
            }
        ]
    }

    onSave();
}

function applyGameInfoWindowsQuickTemplate() {
    const template = $('#gameInfoWindowsQuickTemplates').val();
    
    if (template == 'defaultBottomLeft') {
        config.gameInfoWindows = [ {
            position9Dir:   "bottomLeft",
            twoColumns:     true,
            name:           "Window #1",
            width:          240,
            textLeft:       "\\I[314]\n\\I[190]\n\\I[220]",
            textRight:      "\\$ \\C[16]\\G\n\\}\\MN\n\\PT"
        }];
    }
    if (template == 'defaultBottomRight') {
        config.gameInfoWindows = [ {
            position9Dir:   "bottomRight",
            twoColumns:     true,
            name:           "Window #1",
            width:          240,
            textLeft:       "\\I[314]\n\\I[190]\n\\I[220]",
            textRight:      "\\$ \\C[16]\\G\n\\}\\MN\n\\PT"
        }];
    }
    if (template == 'bottomHorizontal') {
        config.gameInfoWindows = [
            {
            "position9Dir": "bottomLeft",
            "twoColumns": true,
            "name": "Playtime",
            "textLeft": "\\I[220]",
            "textRight": "\\PT",
            "widthMode": "percentage",
            "widthByPercentage": 33.3
            },
            {
            "position9Dir": "bottomCenter",
            "twoColumns": true,
            "name": "Map Name",
            "textLeft": "\\I[190]",
            "textRight": "\\}\\MN",
            "widthMode": "percentage",
            "widthByPercentage": 33.3
            },
            {
            "position9Dir": "bottomRight",
            "twoColumns": true,
            "name": "Gold",
            "textLeft": "\\I[314]",
            "textRight": "\\$ \\C[16]\\G",
            "widthMode": "percentage",
            "widthByPercentage": 33.3
            }
        ]
    }

    onSave();
}

function onSave() {
    writeFile('uicustom/' + CONFIG_NAME, config);

    if (window.opener) UICustom.refreshMainMenu(config);
}

$(document).ready(() => $('#currentVersion').text("Version " + pluginVersion + " Beta"));
$(document).ready(() => fetchLatestVersion(pluginVersion, data => data.latestVersionCore));

if (window.opener) {
    $(document).ready(() => checkCoreScriptsVersion());
    $(document).ready(() => checkPotentialPluginConflicts());
}

function checkCoreScriptsVersion() {
    if (RpgMakerName == 'MZ') {
        toggleVisibility(
            '#requiredCoreScriptVersionWarningBox',
            !compareVersions(
                RpgMakerUtils.RPGMAKER_VERSION,
                UICustom.recommendedCoreCodeVersionMZ,
        ));
        $('#requiredCoreScriptVersion').text(UICustom.recommendedCoreCodeVersionMZ);
    } else {
        toggleVisibility('#requiredCoreScriptVersionWarningBox', false);
    }
}

function checkPotentialPluginConflicts() {
    toggleVisibility('#altMenuScreenPluginOrderWarning',        isPluginCollectionBelowMK('AltMenuScreen'));
    toggleVisibility('#hdLayoutPluginUsedWarning',              hasPlugin('HDLayout'));
    toggleVisibility('#YEPCoreEngineWarning',                   hasPlugin('YEP_CoreEngine'));
    toggleVisibility('#YEPIncorrectPluginOrderWarning',         isPluginCollectionBelowMK('YEP_'));
    toggleVisibility('#VisustellaIncorrectPluginOrderWarning',  isPluginCollectionBelowMK('VisuMZ_'));
    toggleVisibility('#VisustellaButtonAssistWindowWarning',    hasVsButtonAssistWindow());
    toggleVisibility('#VisustellaMainMenuWarning',              hasPlugin('VisuMZ_1_MainMenuCore'));
    toggleVisibility('#VisustellaGaugesCompatibilityWarning',   hasPlugin('VisuMZ_1_SkillsStatesCore'));
}

function hasVsButtonAssistWindow() {
    const buttonAssistWindow = window.opener.SceneManager._scene && window.opener.SceneManager._scene._buttonAssistWindow;
    return buttonAssistWindow && buttonAssistWindow.visible;
}

function syncFormInputs() {

    // RPG Essentials
    updateElements();
    updateSkillTypeIcons();

    // Touch UI
    showTouchUIMode.value       = config.showTouchUIMode || 'always';
    keepTouchUISpace.checked    = !!config.keepTouchUISpace;
    touchUIAreaHeight.value     = config.touchUIAreaHeight;

    // Actors
    syncFormInputsActorSettings();

    $('#whenSelectingActorHorzDash').val(config.whenSelectingActorHorzDash || '');
    $('#whenSelectingActorVertDash').val(config.whenSelectingActorVertDash || '');
    $('#whenSelectingActorScale').val(config.whenSelectingActorScale || '');
    $('#whenSelectingActorOpacity').val(config.whenSelectingActorOpacity || '');
    $('#whenSelectingActorAnimationSpeed').val(config.whenSelectingActorAnimationSpeed || '');
    $('#actorWindowAnchor').val(config.actorWindowAnchor || 'topLeft');

    // Game Info Windows
    syncFormInputsGameInfoWindows();
    $('#unknownMapName').val(config.unknownMapName || '');

    // Commands
    toggle9DirButtons('#commandPosition', config.commandPosition || 'middleLeft');
    updateCommandWindowOrientationButtons();
    
    $('#commandOffsetX').val(config.commandOffsetX || '');
    $('#commandOffsetY').val(config.commandOffsetY || '');
    $('#commandWidth').val(config.commandWidth || '');
    $('#commandNumberOfColumns').val(config.commandNumberOfColumns || '');
    $('#commandNumberOfLines').val(config.commandNumberOfLines || '');

    toggleButton('#commandTextAlignLeft',               'left' == config.commandTextAlign || !config.commandTextAlign);
    toggleButton('#commandTextAlignCenter',             'center' == config.commandTextAlign);
    toggleButton('#commandTextAlignRight',              'right' == config.commandTextAlign);
    toggleVisibility('#commandWindowFileBox',           config.overrideCommandWindow);
    toggleVisibility('#commandItemBackgroundFileBox',   'image' == config.commandItemBackgroundType);

    commandOpacity.value                = config.commandOpacity;
    commandPadding.value                = config.commandPadding;
    commandItemHeight.value             = config.commandItemHeight;
    commandRowSpacing.value             = config.commandRowSpacing;
    commandColumnSpacing.value          = config.commandColumnSpacing;
    commandFontSize.value               = config.commandFontSize;
    commandStyle.value                  = config.commandStyle || 'iconAndText';
    commandItemBackgroundType.value     = config.commandItemBackgroundType || 'dimmed';

    // Layout
    toggleButtons(
        '#commandInputMode',
        ['left', 'right'],
        config.commandInputMode || 'left',
    );

    // Windows General
    windowItemBackgroundType.value = config.windowItemBackgroundType || (RpgMakerName == 'MZ' ? 'dimmed' : 'none');
    toggleVisibility('#windowItemBackgroundFileBox', windowItemBackgroundType.value == 'image');
    
    windowOpacity.value             = config.windowOpacity;
    windowPadding.value             = config.windowPadding;
    windowLineHeight.value          = config.windowLineHeight;
    windowItemHeight.value          = config.windowItemHeight;
    windowItemPadding.value         = config.windowItemPadding;
    windowRowSpacing.value          = config.windowRowSpacing;
    windowColumnSpacing.value       = config.windowColumnSpacing;
    fontSize.value                  = config.fontSize;

    toggleVisibility('#cursorStyleBox', 'image' == config.cursorStyle);
    cursorStyle.value = config.cursorStyle || 'default';
    cursorAdjustX.value = config.cursorAdjustX;
    cursorAdjustY.value = config.cursorAdjustY;
    cursorScale.value = config.cursorScale;
    blinkCursor.checked = config.blinkCursor !== false;

    disabledTextOpacity.value = config.disabledTextOpacity;
    overrideDisabledTextColor.checked = config.overrideDisabledTextColor;
    toggleVisibility('#disabledTextColor', overrideDisabledTextColor.checked);
    disabledTextColor.value = config.disabledTextColor;

    // Gauge Colors
    setTextColor('hpLabelTextColor',        typeof config.hpLabelTextColor == 'number' ? config.hpLabelTextColor : 2);
    setTextColor('hpValueTextColor',        typeof config.hpValueTextColor == 'number' ? config.hpValueTextColor : 0);
    setTextColor('hpCrisisTextColor',       typeof config.hpCrisisTextColor == 'number' ? config.hpCrisisTextColor : 14);
    setTextColor('hpDeadTextColor',         typeof config.hpDeadTextColor == 'number' ? config.hpDeadTextColor : 18);
    setTextColor('mpLabelTextColor',        typeof config.mpLabelTextColor == 'number' ? config.mpLabelTextColor : 1);
    setTextColor('mpValueTextColor',        typeof config.mpValueTextColor == 'number' ? config.mpValueTextColor : 0);
    setTextColor('mpEmptyTextColor',        typeof config.mpEmptyTextColor == 'number' ? config.mpEmptyTextColor : 7);
    setTextColor('tpLabelTextColor',        typeof config.tpLabelTextColor == 'number' ? config.tpLabelTextColor : 3);
    setTextColor('tpValueTextColor',        typeof config.tpValueTextColor == 'number' ? config.tpValueTextColor : 0);
    setTextColor('levelLabelTextColor',     typeof config.levelLabelTextColor == 'number' ? config.levelLabelTextColor : 30);
    setTextColor('levelValueTextColor',     typeof config.levelValueTextColor == 'number' ? config.levelValueTextColor : 0);
    setTextColor('levelMaxedOutTextColor',  typeof config.levelMaxedOutTextColor == 'number' ? config.levelMaxedOutTextColor : 0);

    [
        'gaugeColorHp',
        'gaugeColorHpCrisis',
        'gaugeColorMp',
        'gaugeColorTp',
        'gaugeColorAtb',
        'gaugeColorExp',
        'gaugeColorExpMaxedOut',
    ].forEach(gaugeId => {
        $('#' + gaugeId + '1').val(config[gaugeId + '1'] || getTemplate()[gaugeId + '1']);
        $('#' + gaugeId + '2').val(config[gaugeId + '2'] || getTemplate()[gaugeId + '2']);
    });

    [
        'gaugeBackgroundColorHp',
        'gaugeBackgroundColorHpCrisis',
        'gaugeBackgroundColorHpDead',
        'gaugeBackgroundColorMp',
        'gaugeBackgroundColorTp',
        'gaugeBackgroundColorAtb',
        'gaugeBackgroundColorExp',
    ].forEach(gaugeId => $('#' + gaugeId).val(config[gaugeId] || getTemplate()[gaugeId]));

    // Menu Background
    sceneBackgroundType.value       = config.sceneBackgroundType || 'mapSprite';
    sceneBackgroundEffects.value    = config.sceneBackgroundEffects || 'blurred';

    toggleVisibility('#sceneBackgroundEffectsBox',  'none' != sceneBackgroundType.value);
    toggleVisibility('#sceneBackgroundFileBox',     'image' == sceneBackgroundType.value);
    toggleVisibility('#bgEffectNotSupported',       'image' == sceneBackgroundType.value && RpgMakerName == 'MV');

    // Help Window
    helpLineNumbers.value               = config.helpLineNumbers;
    helpBackOpacity.value               = config.helpBackOpacity;
    helpPadding.value                   = config.helpPadding;
    helpLineHeight.value                = config.helpLineHeight;
    helpFontSize.value                  = config.helpFontSize;
    shouldOverrideHelpWindow.checked    = !!config.shouldOverrideHelpWindow;

    toggleVisibility('#helpWindowFileBox', shouldOverrideHelpWindow.checked);
}

function changeActorLimit(value) {
    config.actorLimit = toNumber(value);
    
    updateActorFormationTable();
    onSave();
}

function onCommandWindowOrientationChange(orientation) {
    config.commandWindowOrientation = orientation;
    
    updateCommandWindowOrientationButtons();
    onSave();
}

function updateCommandWindowOrientationButtons() {
    const orientation = config.commandWindowOrientation || 'vertical';
    
    toggleButtons(
        '#commandWindowOrientation',
        ['vertical', 'horizontal', 'grid'],
        orientation
    );
    $('#commandWidth').attr('placeholder', orientation == 'horizontal' ? 'auto' : '240');
    $('#commandNumberOfColumnsBox').toggle(orientation == 'grid');
    $('#commandNumberOfLinesBox').toggle(orientation == 'grid');
}

function changeCommandItemBackgroundType(value) {
    config.commandItemBackgroundType = value;

    $('#commandItemBackgroundFileBox').toggle('image' == value);
    onSave();
}

function changeInputMode(mode) {
    config.commandInputMode = mode;
    
    toggleButtons('#commandInputMode', ['left', 'right'], mode);
    onSave();
}

function onWindowItemBackgroundTypeChange(type) {
    $('#windowItemBackgroundFileBox').toggle(type == 'image');

    config.windowItemBackgroundType = type;
    onSave();
}

function onCursorStyleChange(style) {
    $('#cursorStyleBox').toggle('image' == style);
    
    config.cursorStyle = style;
    onSave();
}

function onOverrideDisabledTextColorChange(checked) {
    $('#disabledTextColor').toggle(checked);
    
    config.overrideDisabledTextColor = checked;
    onSave();
}

function onSceneBackgroundTypeChange(type) {
    $('#sceneBackgroundEffectsBox').toggle('none' != type);
    $('#sceneBackgroundFileBox').toggle('image' == type);
    $('#bgEffectNotSupported').toggle('image' == type && RpgMakerName == 'MV');

    config.sceneBackgroundType = type;
    onSave();
}


function updateElements() {
    $('#elementsTableBody')
        .empty()
        .append(getElements().map((element, index) => {
            const checkbox = $('<input></input>')
                .attr('type', 'checkbox')
                .attr('checked', element.visible)
                .addClass('form-check-input')
                .on('change', (e) => onElementVisibilityChange(index, e.target.checked));

            const iconPicker = buildIconPicker(
                null,
                null,
                (iconIndex) => onElementIconChange(index, iconIndex),
            );

            iconPicker.find('.icon-picker-value').val(element.iconIndex || 0);
            renderIconPreview(iconPicker.find('.icon-picker-preview')[0], element.iconIndex || 0);

            return $('<tr></tr>')
                .append($('<td></td>').append(checkbox))
                .append($('<td></td>').text(element.name))
                .append($('<td></td>').append(iconPicker));
        })
    );
}

const defaultElementIcons = [ 77, 64, 65, 66, 67, 68, 69, 70, 71, 72 ];

function getElements() {
    const coreElements  = getElementNamesFromRpgMaker();
    const elementIcons  = config.elementIcons || defaultElementIcons;
    const visibilities  = config.elementVisibilities || coreElements.map((_, index) => index > 0);

    return coreElements.map((name, index) => ({
        name:       name,
        iconIndex:  elementIcons[index],
        visible:    !!visibilities[index],
    }));
}

function getElementNamesFromRpgMaker() {
    const dataSystem = window.opener ? window.opener.$dataSystem : null;

    return dataSystem
        ? dataSystem.elements.slice(1)
        : ["Physical", "Fire", "Ice", "Thunder", "Water", "Earth", "Wind", "Holy", "Dark"];
}

function onElementVisibilityChange(index, visible) {
    if (!config.elementVisibilities) {
        config.elementVisibilities = getElements().map((_, index) => index > 0);
    }
    config.elementVisibilities[index] = visible;
    onSave();
}

function onElementIconChange(index, iconIndex) {
    if (!config.elementIcons) {
        config.elementIcons = getElements().map((_, index) => defaultElementIcons[index]);
    }
    config.elementIcons[index] = iconIndex;
    onSave();
}

function updateSkillTypeIcons() {
    const iconIndex = (index) => config.skillTypeIcons ? config.skillTypeIcons[index] : defaultSkillTypeIcons[index];

    $('#skillTypeIconsTableBody')
        .empty()
        .append(getSkillTypeNames().map((skillTypeName, index) => {
            const iconPicker = buildIconPicker(
                null,
                null,
                (newIconIndex) => onSkillTypeIconChange(index, newIconIndex),
            );
            
            iconPicker.find('.icon-picker-value').val(iconIndex(index));
            renderIconPreview(iconPicker.find('.icon-picker-preview')[0], iconIndex(index));

            return $('<tr></tr>')
                .append($('<td></td>').text(skillTypeName))
                .append($('<td></td>').append(iconPicker));
        })
    );
}

const defaultSkillTypeIcons = [ 79, 78 ];

function getSkillTypeNames() {
    const dataSystem = window.opener ? window.opener.$dataSystem : null;
    
    return dataSystem
        ? dataSystem.skillTypes.slice(1)
        : ["Magic", "Special", "Support", "Summon"];
}

function onSkillTypeIconChange(index, iconIndex) {
    if (!config.skillTypeIcons) {
        config.skillTypeIcons = getSkillTypeNames().map((_, index) => defaultSkillTypeIcons[index]);
    }
    config.skillTypeIcons[index] = iconIndex;
    onSave();
}


function fetchNews() {
    if (window.opener && window.opener.UICustom.showNews) {
        $.ajax({
            url:        'http://downloads.aerosys.blog/plugins/news.json',
            type:       'GET',
            dataType:   'json',
            timeout:    5000,
            cache:      false,
            success:    (data) => onFetchNewsSuccess(data),
            error:      () => $('#newsMessage').text("Unable to load news. The server is not available right now or you don't have an internet connection."),
        });
    } else {
        $('#newsBoxContainer').hide();
    }
};

function onFetchNewsSuccess(data) {
    $('#newsMessage').text(data.message);
    $('#newsLink').attr('href', data.link);

    if (data.backgroundColor)   $('#newsBox').css('background-color', data.backgroundColor);
    if (data.textColor)         $('#newsBox').css('color', data.textColor);
    if (data.borderColor)       $('#newsBox').css('border-color', data.borderColor);
    if (data.buttonActionText)  $('#newsLink').text(data.buttonActionText);  
}

$(document).ready(() => fetchNews());


function healActor() {
    partyMembers().forEach(actor => {
        actor.setHp(Math.floor(actor.mhp * 0.8));
        actor.setMp(Math.floor(actor.mmp * 0.8));
        actor.setTp(Math.floor(actor.maxTp() * 0.8));
    });
    refreshScene();
}

function makeActorCrisis() {
    partyMembers().forEach(actor => {
        actor.setHp(Math.floor(actor.mhp * 0.2));
    });
    refreshScene();
}

function makeActorDead() {
    if (partyMembers().length >= 2) {
        partyMembers()[0].setHp(0);
        refreshScene();
    }
}

function makeActorExpMaxedOut() {
    partyMembers().forEach(actor => {
        actor.changeLevel(actor.maxLevel());
    });
    refreshScene();
}

function undoMakeActorExpMaxedOut() {
    partyMembers().forEach(actor => {
        actor.changeLevel(1);
        actor.changeExp(Math.floor(actor.nextLevelExp() * 0.7));
    });
    refreshScene();
}

function applyStates() {
    partyMembers().forEach(actor => {
        range(4, 11).forEach(stateId => actor.addState(stateId));
    });

    refreshScene();
}

function clearStates() {
    partyMembers().forEach(actor => {
        range(4, 11).forEach(stateId => actor.removeState(stateId));
    });

    refreshScene();
}

function leader() {
    return window.opener ? window.opener.$gameParty.leader() : null;
}

function partyMembers() {
    return window.opener ? window.opener.$gameParty.members() : [ ];
}

function refreshScene() {
    if (window.opener) {
        window.opener.SceneManager.goto(window.opener.Scene_Menu);
    }
}

function openCloseTargetActorWindow() {
    const scene = window.opener.SceneManager._scene;
    
    if (scene && scene.openCloseTargetActorWindow) {
        scene.openCloseTargetActorWindow();
    }
}
