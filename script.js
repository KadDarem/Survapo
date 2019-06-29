var ChoixActif = true;
var CarteSuivanteD = 0;
var CarteSuivanteG = 0;
var ChoixClic = -1;
var DropItemSelect = 0;
var Audio = {
    Volume : 1,
    Slide : new Audio('son/slide.wav'),
    Retournement : new Audio('son/retournement.wav'),
    Clic : new Audio('son/clic.wav'),
    Glisse : new Audio('son/glisse.mp3'),
    Forest : new Audio('son/forest.mp3'),
    Succes : new Audio('son/succes.wav')
}
Audio.Clic.volume = Audio.Volume*0.5;
function AugmenterVolume(Elmt) {
    Elmt.volume +=0.01;
    if (Elmt.volume < (Audio.Volume * 0.1)) {
        setTimeout(function(){
            AugmenterVolume(Elmt);
        },100)
    }
}
var ListFond = ['foret','industrie','ville']

var Player = {
    username : '',
    Nom : 'John Albert',
    Inventaire : [],
    Stats : {faim : 50,fatigue : 50,mental : 50,sante : 50},
    Nb_Jour : 1,
    CarteActive : 'Intro1',
    Intro : true,
    EnchainementCartes : [],
    Succes : [],
    Tuto : true,
    Difficulte : 'normal',
}


$(document).mousemove(function() {
    if (ChoixActif) {
        if ($('body').find('#gauche:hover').length == 1) {
            Slide(0);
        }
        if ($('body').find('#droite:hover').length == 1) {
            Slide(1);
        }
    }
})

$(window).resize(function() {
    RecarderPage();
});
$(window).ready(function() {
    $('#chargement_cache').remove();
    RecarderPage();
    FermerAllDiv();
    OuvrirDiv('home');
    //$('body').css('background-image','url(image/fonds/' + ListFond[IdFond] +'.jpg)');
    $('body').css('background-image','url(image/fonds/foret.jpg)');
    $('#jouer').click(function(){
        fermerDiv('home');
        if (Player.EnchainementCartes.length == 0) {
            OuvrirDiv('div_parametre_partie');
        } else {
            OuvrirDiv('div_jeu');
            InitGame();
            UpdateCarte();
            InitInv();
            Tuto();
        }
    });
    $('#StartGame').click(function(){
        if (UsernameValide()) {
            fermerDiv('div_parametre_partie');
            OuvrirDiv('div_jeu');
            Player.Tuto = $('#InputTuto').is(':checked') ? true : false;
            Player.Difficulte = $('#difficulte').val() == 1 ? 'normal' : 'difficile';
            InitGame();
            UpdateCarte();
            InitInv();
            Tuto();
        }
    });
    $('#charger').click(function () {
        FermerAllDiv();
        OuvrirDiv('div_charger');
        $('#pseudo_charger').focus();
        //SwapCard();
    });
    $('#succes').click(function () {
        $('#liste_succes').html('');
        Object.entries(ListeSucces).forEach(function(ligne) {
            let code = "<li>";
            code += (Player.Succes.indexOf(ligne[0]) != -1) ? "<div class='fas fa-check'></div>" : '';
            code += "<img src='image/succes/";
            code += (ligne[1].hide && Player.Succes.indexOf(ligne[0]) == -1) ? 'hide' : ligne[0];
            code += "'/><div><h2>" + ligne[1].titre + "</h2><h3>";
            code += (ligne[1].hide && Player.Succes.indexOf(ligne[0]) == -1) ? '???' : ligne[1].desc;
            code += "</h3></div></li>";
            $('#liste_succes').append(code);
        });
        FermerAllDiv();
        OuvrirDiv('div_succes');
        //SwapCard();
    });
    $('#credit').click(function() {
        PlayAudioClic();
        FermerAllDiv();
        OuvrirDiv('div_credit');
    })
    /* TriggerSouris */
    $(".items")
    .mouseenter(function() {
        var id = $(this).attr('data-id') -1;
        if (Player.Inventaire[id] != undefined && !$('#Drop_inv>div').hasClass('active')) {
            if (IsUtilisable(Player.Inventaire[id])) {
                AfficherStat(ListItems[Player.Inventaire[id]].stat);
            }
        }
    })
    .mouseleave(function() {
        FermerStat();
    })
    .click(function() {
        var id = $(this).attr('data-id') -1;
        if (Player.Inventaire[id] != undefined && !$('#Drop_inv>div').hasClass('active')) {
            if (IsUtilisable(Player.Inventaire[id])) {
                Audio.Clic.volume = Audio.Volume;
                Audio.Clic.play();
                UtiliserItem(id);
                Sauvegarder();
            }
        }
    })
    /* TriggerGauche */
    $('#gauche')
        .mouseenter(function() {
            if (ChoixActif) {
                Slide(0);
            }
        })
        .mouseleave(function () {
            if (ChoixActif) {
                ResetSlide();
            }
        })
        .click(function() {
            if (ChoixActif) {
                Clique(0);
            }
        })
    /* TriggerDroite */
    $('#droite')
    .mouseenter(function() {
        if (ChoixActif) {
            Slide(1);
        }
    })
    .mouseleave(function () {
        if (ChoixActif) {
            ResetSlide();
        }
    })
    .click(function() {
        if (ChoixActif) {
            Clique(1);
        }
    })
    $('.bouton_retour')
    .click(function() {
        FermerAllDiv();
        OuvrirDiv('home');
    })
    $('#setup')
    .click(function() {
        FermerAllDiv();
        OuvrirDiv('div_setup');
        $('#volume').val(Audio.Volume*100);
    })
    $('#charger_partie').click(function(){
        let data = {
            action : 'check_username',
            username : encodeURI($('#pseudo_charger').val())
        }
        var exp=new RegExp("[a-zA-Z\-]+","g");
        if (exp.test(data.username)) {
            $.ajax({
                url:'ajax.php',
                type : 'POST',
                data : data,
                success : function(response) {
                    if (response.length > 0) {
                        alert('Partie chargée');
                        Player = JSON.parse(response);
                        FermerAllDiv();
                        OuvrirDiv('home');
                    } else {
                        alert('Pseudo non connu.');
                    }
                }
            })
        } else {
            alert("Merci de n'utiliser que des lettres et des chiffres");
        }
    })
    $('#popup-close')
    .click(function() {
        ClosePopup()
    })
})

function PlayAudioClic() {
    Audio.Clic.volume = Audio.Volume;
    Audio.Clic.play();
}
function RecarderPage() {
    var navigateur = navigator.userAgent;
    var zoom = window.innerHeight / $('body').height();
    if (navigateur.match('Chrome') == null) {
        $('body').css("transform",'scale('+zoom+')');
    } else {
        $('body').css("zoom",zoom);
    }
}

function FermerAllDiv() {
    $('#main > div').each(function () {
        $('#'+this.id).css('opacity',0);
        $('#'+this.id).css('display','none');
    });
}

function UsernameValide() {
    if (Player.username != '' || Player.EnchainementCartes.length > 0) return true;
    var exp=new RegExp("[a-zA-Z\-]+","g");
    var username = prompt("Merci d'entrer un pseudo pour la sauvegarde", "");
    var valide = false
    if (username != '' && username != null) {
        if (!exp.test(username)) {
            alert("Merci de n'utiliser que des lettres et des chiffres");
            valide = UsernameValide();
        } else {
            if (username == 'test') {
                var AllerACarte = prompt("Merci d'entrer le numéro de la carte");
                if (AllerACarte != '' && AllerACarte != null) {
                    Player.CarteActive = AllerACarte;
                    Player.Intro = false;
                    valide = true;
                }
            } else {
                $.ajax({
                    url:'ajax.php',
                    type : 'POST',
                    data : {action : 'check_username',username : encodeURI(username)},
                    async: false,
                    success : function(response) {
                        if (response.length > 0) {
                            alert('Username déjà existant');
                            valide = UsernameValide();
                        } else {
                            Player.username = encodeURI(username);
                            valide = true;
                        }
                    }
                });
            }
        }
    } else if (username == '') {
        valide = UsernameValide();
    }
    return valide;
}
function OuvrirDiv(div) {
    $('#'+div).css('display','block');
    $('#'+div).css('opacity',1);
    if (div == 'div_jeu') {
        $('#selector').css('display','block');
        $('#BoutonRetour').css('display','block');
    } else {
        $('#selector').css('display','none');
        $('#BoutonRetour').css('display','none');
    }
}
function fermerDiv(div) {
    $('#'+div).css('opacity','0');
    setTimeout(function() {
        $('#'+div).css('display','none');
    }, 1000);
}

function Updatestat(stats) {
    for (var Barre in stats) {
        var Value = stats[Barre];
        if (Value != 0) {
            Player.Stats[Barre] += Value;
            if (Player.Stats[Barre] > 100) Player.Stats[Barre] = 100;
            if (Player.Stats[Barre] < 0) Player.Stats[Barre] = 0;
            if (Value > 0) {
                $('#value-' + Barre).css('color','lime');
            } else {
                $('#value-' + Barre).css('color','red');
            }
            $('#value-' + Barre).css('height',Player.Stats[Barre] + '%');
            $('#value-' + Barre).css('transition','height 1s linear');
            setTimeout(function(Barre) {
                $('#value-' + Barre).css('transition','all 1s linear, background-color 0.5s linear');
                $('#value-' + Barre).css('color','white');
            },1000, Barre);
        }
    }
}
function Slide(value) {
    var Angle = value == 0 ? -10 : 10;
    var translate = value == 0 ? -50 : 50;
    if (value == 0) {
        $('#gauche_bg').css('background-color','rgba(0, 0, 0, 0.60)');
        $('#textG').html(ListeCarte[Player.CarteActive].textG);
    } else {
        $('#droite_bg').css('background-color','rgba(0, 0, 0, 0.60)');
        $('#textD').html(ListeCarte[Player.CarteActive].textD);
    }
    $('#currentcard').css('transform-origin','center bottom');
    $('#currentcard').css('transform','rotateZ('+Angle+'deg) translateX('+translate+'px)');

    var Cote = value == 0 ? 'statG' : 'statD';
    AfficherStat(ListeCarte[Player.CarteActive][Cote]);
}

function AfficherStat(stats) {
    for (var stat in stats) {
        var value = Math.abs(stats[stat]);
        $('#impact-' + stat).css('height', (100*value/100) + 'px');
        $('#impact-' + stat).css('width', (100*value/100) + 'px');
    }
}

function FermerStat() {
    for (var stat in ListeCarte[Player.CarteActive].statD) {
        $('#impact-' + stat).css('width','0px');
    }
}
function ResetSlide() {
    $('#currentcard').css('transform','rotateZ(0deg) translateX(0)');
    $('#gauche_bg').css('background-color','inherit');
    $('#droite_bg').css('background-color','inherit');
    $('#textD').html('');
    $('#textG').html('');
    FermerStat();
}

function Clique(value) {
    ClosePopup();
    hidestaritem();
    ChoixClic = value == 0 ? 'G' : 'D';
    $('#currentcard').css('opacity','0');
    Audio.Glisse.volume = Audio.Volume;
    Audio.Glisse.play();
    ChoixActif = false;
    $('#description').css('opacity',0);
    if (Player.CarteActive == '-2') {
        fermerDiv('div_jeu');
        OuvrirDiv('home');
        ResetPartie();
        Sauvegarder();
        return;
    }
    if (!Player.Intro) {
        Updatestat(ListeCarte[Player.CarteActive]['stat' + ChoixClic]);
        UpdateInv();
    } else {
        if (Player.CarteActive == ('Intro1') && ChoixClic == "D") {
            let nom = prompt("Merci d'entrer votre nom", "John Albert");
            if (nom != null && nom != "") {
                Player.Nom = nom;
            }
        }
    }
    setTimeout(function() {
        if (ListeCarte[Player.CarteActive]['conclusion'+ChoixClic] == undefined) {
            UpdateCarte();
        } else if (ListeCarte[Player.CarteActive]['conclusion'+ChoixClic].length == '') {
            UpdateCarte();
        } else if (ListeCarte[Player.CarteActive].desc != ''){
            UpdateConclusion();
        }
        TurnCard();
        ResetSlide();
        Audio.Retournement.volume = Audio.Volume;
        Audio.Retournement.play();
        TesterSucces();
        setTimeout(function() {
            SwapCard();
            Sauvegarder();
            if (!$('#Drop_inv>div').hasClass('active')) {
                ChoixActif = true;
            }
            Tuto();
        }, 1000);
    }, 500);
}

function SwapCard() {
    $('#currentcard').toggleClass('NoTransition');
    $('#currentcard').css('opacity','1');
    TurnCard();
    setTimeout(function() {
        $('#currentcard').toggleClass('NoTransition');
    }, 100);
}
function UpdateCarte(id) {
    $('.ecriture_ds_carte').html('');
    if (finJeu()) {
        var CauseFin = '';
        if (Player.Stats['faim'] == 0) {
            CauseFin = 'faim';
        } else if (Player.Stats['sante'] == 0) {
            CauseFin = 'sante';
        } else if (Player.Stats['fatigue'] == 0) {
            CauseFin = 'fatigue'
        }
        $('#display_current').css('background-image','url(image/fin/mort-'+ CauseFin +'.png)');
        $('.front').css('background-image','url(image/fin/mort-'+ CauseFin +'.png)');
        var desc = CartesFin[CauseFin].desc;
        Player.CarteActive = '-2';
        ListeCarte['-2'] = { desc : CartesFin[CauseFin].desc,textG :'Gameover',statG : {faim:0,fatigue:0,mental:0,sante:0},recompenseG : '-1',conclusionG : '',suiteG : 'Menu',textD : 'Gameover',statD : {faim:0,fatigue:0,mental:0,sante:0},recompenseD : '-1',conclusionD : '',suiteD :'Menu'};
        setTimeout(function(){
            $('#description').css('opacity',1);
            $('#description').html(desc);
        },500);
    } else {
        if (id != undefined) {
            Player.CarteActive = id
        } else {
            if (ChoixClic != -1) {
                Player.CarteActive = ChoixClic == 'G' ? CarteSuivanteG : CarteSuivanteD;
            }
        }
        RemplacementCarte();
        UpdateEnvironnement();
        if (ListeCarte[Player.CarteActive] == undefined) {
            if (Player.CarteActive != "Retour_Menu") {
                console.log(Player.CartesActive)
                alert("Une erreur s'est produite, merci de nous remonter l'erreur sur la carte n°"+Player.CartesActive);
            }
            fermerDiv('div_jeu');
            OuvrirDiv('home');
            ResetPartie();
        } else {
            Player.EnchainementCartes.push(Player.CarteActive);
            $('#display_current').css('background-image','url(image/cartes/'+Player.CarteActive+'.png)');
            $('.front').css('background-image','url(image/cartes/'+Player.CarteActive+'.png)');
            var desc = ListeCarte[Player.CarteActive].desc;
            if (Player.CarteActive == ('Intro2')) {
                desc += ' '+Player.Nom+ListeCarte[Player.CarteActive].desc2;
            }
            setTimeout(function(){
                $('#description').css('opacity',1);
                $('#description').html(desc);
            },500);
            CarteSuivanteD = RandomNext('D');
            CarteSuivanteG = RandomNext('G');
        }
    }
}
function UpdateConclusion() {
    $('#display_current').css('background-image','url(image/cartes/vide.png)');
    $('.front').css('background-image','url(image/cartes/vide.png)');
    $('.ecriture_ds_carte').html(ListeCarte[Player.CarteActive]['conclusion'+ChoixClic]);
    $('#description').html('');
    var suite = ListeCarte[Player.CarteActive]['suite'+ChoixClic];
    Player.CarteActive = '-1';
    ListeCarte['-1'] = { desc : '',textG :'',statG : {faim:0,fatigue:0,mental:0,sante:0},recompenseG : '-1',conclusionG : '',suiteG : suite,textD : '',statD : {faim:0,fatigue:0,mental:0,sante:0},recompenseD : '-1',conclusionD : '',suiteD :suite};
    CarteSuivanteD = RandomNext(ChoixClic);
    CarteSuivanteG = RandomNext(ChoixClic);
}
function finJeu() {
    if (Player.Stats['faim']*Player.Stats['sante']*Player.Stats['fatigue'] == 0) {
        return true
    }
    return false;
}
function RandomNext(Cote) {
    var MaxCarte = ListeCarte[Player.CarteActive]['suite' + Cote].length;
    var IdCarte = RandomCarte(MaxCarte);
    var CarteSuivante = ListeCarte[Player.CarteActive]['suite' + Cote][IdCarte];
    return CarteSuivante
}

function RemplacementCarte() {
    var IdCarte = Player.CarteActive;
    if (EchangeCarte[IdCarte] !== undefined ) {
        EchangeCarte[IdCarte].ItemRequis.forEach(function(ItemRequis) {
            Player.Inventaire.forEach(function(Item) {
                if (ItemRequis == Item) {
                    Player.CarteActive = EchangeCarte[IdCarte].Carte;
                    return;
                }
            })
        })
    }
    return;
}

function TurnCard() {
    $('#img').css('transform','');
    $('#img').css('transform-origin','center right');
    $('#img').toggleClass('is-flipped');
}

function RandomCarte(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function InitInv() {
    var count = 1;
    UpdateAffichageInv()
}
function UtiliserItem(place) {
    Updatestat(ListItems[Player.Inventaire[place]].stat);
    DeleteItem(place);
}
function DeleteItem(place) {
    Player.Inventaire.splice(place,1);
    UpdateAffichageInv();
}
function SetImgInv(place,id) {
    $('#img-inv'+place).html("<img src ='image/items/items-"+id+".png'/>");
    $('#inv'+place).removeClass('vide');
    $('#util-inv'+place).removeClass();
    $('#titre-inv'+place).html(ListItems[id].name);
    if (!IsUtilisable(id)) {
        $('#inv'+place).removeClass('item-utilisable');
        $('#util-inv'+place).html("Passif");
        $('#util-inv'+place).addClass("red");
    } else {
        $('#inv'+place).addClass('item-utilisable');
        $('#util-inv'+place).html("Utilisable");
        $('#util-inv'+place).addClass("green");
    }
}
function UpdateAffichageInv() {
    for (var i = 1; i <= 4; i++) {
        $('#inv'+i).removeClass('item-utilisable');
        if (Player.Inventaire[i-1] != undefined) {
            SetImgInv(i,Player.Inventaire[i-1]);
        } else {
            $('#inv'+i).addClass('vide');
            $('#img-inv'+i).html('');
        }
    }
}
function IsUtilisable(id) {
    if (ListItems[id] != undefined) {
        if (ListItems[id].stat.faim + ListItems[id].stat.fatigue +ListItems[id].stat.mental +ListItems[id].stat.sante == 0) {
            return false;
        }
    }
    return true;
}
function UpdateInv() {
    var recompense = ListeCarte[Player.CarteActive]['recompense'+ChoixClic];
    if (recompense != '-1' && recompense.length > 0) {
        setTimeout(function(){
            ChoixActif = false;
            DivJeterItem(recompense, function(reponse) {
                ChoixActif = true;
                if (reponse) {
                    Player.Inventaire.push(recompense);
                    SetImgInv(Player.Inventaire.length,recompense);
                    $('#item-star'+Player.Inventaire.length).css('opacity',1);
                    Audio.Succes.volume = Audio.Volume;
                    Audio.Succes.play();
                }
            })
        },1000);
    }
}

function DivJeterItem(recompense,callback) {
    if (Player.Inventaire.length <4) {
        callback(true);
    } else {
        $('#Drop_inv').css('display','block');
        $('#nom_drop').html(ListItems[recompense].name);
        var place = 1;
        Player.Inventaire.forEach(function(id) {
            $('#drop-img-inv'+place).html("<img src ='image/items/items-"+id+".png'/>");
            $('#drop-util-inv'+place).removeClass();
            $('#drop-titre-inv'+place).html(ListItems[id].name);
            if (!IsUtilisable(id)) {
                $('#drop-util-inv'+place).html("Passif");
                $('#drop-util-inv'+place).addClass("red");
            } else {
                $('#drop-util-inv'+place).html("Utilisable");
                $('#drop-util-inv'+place).addClass("green");
            }
            place++;
        })
        $('#Drop_inv>div>div').click(function() {
            var id = $(this).attr('data-id') -1;
            $('#Drop_inv').css('opacity','0');
            $('#Drop_inv>div').removeClass('active');
            if (id < 5) {
                DeleteItem(id);
                callback(true);
            } else {
                callback(false);
            }
        })
        setTimeout(function() {
            $('#Drop_inv').css('opacity','1');
            $('#Drop_inv>div').addClass('active');

        },100);
    }
}

function PlayAudio(Action) {
    Audio[Action].loop = true;
    Audio[Action].volume = 0;
    Audio[Action].play();
    AugmenterVolume(Audio[Action]);
}

function StopAudio(Action) {
    if (Audio[Action].volume > 0.01) {
        Audio[Action].volume -=0.01;
    } else {
        Audio[Action].volume = 0;
    }
    if (Audio[Action].volume > 0) {
        setTimeout(function(){
            StopAudio(Action);
        },100)
    }
}


function Sauvegarder() {
    if (Player.CarteActive != '-1') {
        var data = {
            data : JSON.stringify(Player),
            action : 'sauvegarde',
            username : encodeURI(Player.username)
        }
        $.ajax({
            url:'ajax.php',
            type : 'POST',
            data : data,
            success : function(response) {
            }
        })
    }
}

function TesterSucces() {
    if (Player.CarteActive == 'Intro7') {
        if (Player.Succes.indexOf('curieux') == "-1") {
            if (Player.EnchainementCartes.indexOf('Intro5') != "-1") {
                Player.Succes.push('curieux');
                AfficherPopup('curieux');
            }
        }
    }
    if (Player.Succes.indexOf('animaux') == '-1') {
        if (Player.EnchainementCartes.indexOf('9') != "-1") {
            Player.Succes.push('animaux');
            AfficherPopup('animaux');
        }
    }
    if (Player.CarteActive == '31') {
        if (Player.Succes.indexOf('confiance') == "-1") {
            Player.Succes.push('confiance');
            AfficherPopup('confiance');
        }
    }
    if (Player.CarteActive == '32') {
        if (Player.Succes.indexOf('trahison') == "-1") {
            Player.Succes.push('trahison');
            AfficherPopup('trahison');
        }
    }
    if (Player.CarteActive == '42') {
        if (Player.Succes.indexOf('discretion') == "-1") {
            if (Player.EnchainementCartes.indexOf('42') != "-1") {
                Player.Succes.push('discretion');
                AfficherPopup('discretion');
            }
        }
    }
    if (Player.CarteActive == '41') {
        if (Player.Succes.indexOf('discretion') == "-1") {
            Player.Succes.push('discretion');
            AfficherPopup('discretion');
        }
    }
    if (Player.CarteActive == '412') {
        if (Player.Succes.indexOf('medecin') == "-1") {
            if (Player.EnchainementCartes.indexOf('414.2') != "-1") {
                Player.Succes.push('medecin');
                AfficherPopup('medecin');
            }
        }
    }
    if (Player.CarteActive == '424' || Player.CarteActive == '426') {
        if (Player.Succes.indexOf('pilote') == "-1") {
            Player.Succes.push('pilote');
            AfficherPopup('pilote');
        }
    }
    if (Player.CarteActive == '320') {
        if (Player.Succes.indexOf('feu') == "-1") {
            Player.Succes.push('feu');
            AfficherPopup('feu');
        }
    }
    if (Player.CarteActive == '510') {
        if (Player.Succes.indexOf('monstre') == "-1") {
            Player.Succes.push('monstre');
            AfficherPopup('monstre');
        }
    }
    if (Player.CarteActive == '314') {
        if (Player.Succes.indexOf('architecte') == "-1") {
            Player.Succes.push('architecte');
            AfficherPopup('architecte');
        }
    }
    if (Player.CarteActive == "FIN") {
        if (Player.Succes.indexOf('survivant') == '-1') {
            Player.Succes.push('survivant');
            AfficherPopup('survivant');
        }
    }
}
function AfficherPopup(IdSucces) {
    $('#popup-img-succes').attr('src','image/succes/'+IdSucces+'.png');
    $('#popup-desc').html(ListeSucces[IdSucces].titre);
    $('#popup-succes').css('bottom','40px');
    Audio.Succes.volume = Audio.Volume;
    Audio.Succes.play();
}
function ClosePopup() {
    $('#popup-succes').css('bottom','-200px');
}
function UpdateVolume(value) {
    Audio.Volume = value/100;
    $('#icon-audio').removeClass();
    if( value > 66) {
        $('#icon-audio').addClass('fas fa-volume-up');
    } else if (value > 33) {
        $('#icon-audio').addClass('fas fa-volume-down');
    } else if (value > 0) {
        $('#icon-audio').addClass('fas fa-volume-off');
    } else {
        $('#icon-audio').addClass('fas fa-volume-mute');
    }
    Audio.Clic.volume = Audio.Volume*0.5;
}
function hidestaritem() {
    for (var i = 1; i <= 4; i++) {
        $('#item-star'+i).css('opacity',0);
    }
}

var NombreDeSwitchTuto = 4
var SwitchActuelle = 0

function SwitchTuto() {
    var position = SwitchActuelle%2 == 0 ? '20%' : '80%';
    $('#souris img').css('left',position);
    setTimeout(function() {
        position = SwitchActuelle%2 == 0 ? 0 : 1;
        Slide(position);
        setTimeout(function() {
            ResetSlide();
            SwitchActuelle ++;
            if (SwitchActuelle < NombreDeSwitchTuto) {
                SwitchTuto();
            } else {
                $('#souris img').css('display','none');
                ChoixActif = true;
                SwitchActuelle = 0;
            }
        },1500)
    },500)
}
function Tuto() {
    if (SwitchActuelle < NombreDeSwitchTuto && Player.Tuto) {
        var Duree = 2000
        if (Player.CarteActive == "Intro1" || Player.CarteActive == "Intro2") {
            SwitchActuelle = 0;
            ChoixActif = false;
            var souris = false;
            if (Player.CarteActive == "Intro1") {
                souris = true;
                Duree = 000
            }
            setTimeout(function() {
                if (souris==true) {$('#souris img').css('display','block')};
                $('#souris img').css('left','50%');
                setTimeout(function() {
                    SwitchTuto();
                },100);
            },Duree);
        }
    }
}

function InitGame() {
    if (Player.Difficulte == 'normal') {
        $('#impact').css('display','block');
    } else {
        $('#impact').css('display','none');
    }
}

function ResetPartie() {
    Player.Nom = '';
    Player.Inventaire = [];
    Player.Stats = {faim : 50,fatigue : 50,mental : 50,sante : 50};
    Player.Nb_Jour = 1;
    Player.CarteActive = 'Intro1';
    Player.Intro = true;
    Player.EnchainementCartes = [];
    Player.Tuto = true;
    Player.Difficulte = 'normal';
}

function UpdateEnvironnement() {
    if (Player.CarteActive == 'Carte') {
        Player.CarteActive = '1';
        PlayAudio('Forest');
        Player.Intro = false;
    }
    if (Player.CarteActive == "scénario 2") {
        Player.CarteActive = '20';
        StopAudio('Forest');
        $('body').css('background-image','url(image/fonds/ville.jpg)');
    }
    if (Player.CarteActive == "scénario 3") {
        Player.CarteActive = '300';
        StopAudio('Forest');
        PlayAudio('Forest');
        $('body').css('background-image','url(image/fonds/foret.jpg)');
    }
    if (Player.CarteActive == "scénario 4") {
        Player.CarteActive = '400';
        StopAudio('Forest');
        StopAudio('Forest');
        $('body').css('background-image','url(image/fonds/ville.jpg)');
    }
    if (Player.CarteActive == "scénario 5") {
        Player.CarteActive = '500';
        StopAudio('Forest');
        $('body').css('background-image','url(image/fonds/industrie.jpg)');
    }
}
