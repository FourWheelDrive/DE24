class cmdHandler {
    constructor() {
        this.textAreaElement = document.getElementById("terminal-inputLine");
        this.cmdprompt = "EP C:\\Users\\deof> ";
        this.inventory = [];

        this.terminalTextElement = document.getElementById("terminal-header");

        //Focus the textarea.
        this.textAreaElement.focus();
        this.textAreaElement.selectionStart = this.textAreaElement.value.length;

        this.bubbleMinSize = 50;
        this.bubbleMaxSize = 200;
    }
    cmdIn() {
        let response = this.textAreaElement.value;
        response = sanitize(response);

        //Ready next command line.
        this.textAreaElement.value = this.cmdprompt;
        this.cmdOut(response);

        //Process response.
        let cmdStr = response.split(" ");
        //handle cmd
        switch (cmdStr[2]) {
            case ".help":
                this.cmdOut(".init                  Initialize this program.");
                this.cmdOut(".help                  Opens this dialogue.");
                this.cmdOut(".inv                   View the inventory.");
                this.cmdOut(".get <item>            Get an item from storage, e.g. '.get lab_coat'.");
                break;
            case ".get":
                //A nested SWITCH for item, and append to inventory.
                if (typeof cmdStr[3] === undefined) {
                    this.cmdOut("ERROR: No item provided.");
                } else {
                    //to Lower everything.
                    let item = cmdStr[3].toLowerCase();
                    switch (item) {
                        case "lab coat":
                        case "lab":
                        case "lab_coat":
                            if (this.inventory.includes("lab coat")) {
                                this.cmdOut("Already got lab coat!");
                            } else {
                                this.inventory.push("lab coat");
                                this.cmdOut("Got lab coat!");
                            }
                            break;
                        case "gloves":
                            if (this.inventory.includes("gloves")) {
                                this.cmdOut("Already got gloves!");
                            } else {
                                this.inventory.push("gloves");
                                this.cmdOut("Got gloves!");
                            }
                            break;
                        case "goggles":
                            if (this.inventory.includes("goggles")) {
                                this.cmdOut("Already got goggles!");
                            } else {
                                this.inventory.push("goggles");
                                this.cmdOut("Got goggles!");
                            }
                            break;
                        default:
                            this.cmdOut("ERROR: Item not recognized. Try: 'lab coat', 'goggles', 'gloves'.");
                    }
                }

                break;
            case ".inv":
                this.cmdOut(`Inventory: [${this.inventory[0]}, ${this.inventory[1]}, ${this.inventory[2]}]`);
                break;
            case ".init":
                //Checks?
                if(this.inventory.includes("lab coat") && this.inventory.includes("goggles") && this.inventory.includes("gloves")){
                    this.initBegin();
                    return; //exit this phase.
                } else {
                    this.cmdOut("ERROR: You are missing something to initialize this program. Required: Lab Coat, Gloves, Goggles.");
                    this.cmdOut("Run '.inv' to check the inventory.")
                    this.cmdOut("Run '.get lab coat' to get a lab coat.")
                }
                break;
            default:
                this.cmdOut(`The term '${cmdStr[2]}' cannot be recognized as a command. Type '.help' for help.`);
                break;
        }
        this.cmdOut("");
    }

    cmdOut(message) {
        let res = document.createTextNode(message + "\n");
        this.terminalTextElement.appendChild(res);
    }

    async initBegin() {
        var body = document.getElementsByTagName("BODY")[0];
        //I can trigger animations by adding a class.
        //Hide the text area.
        this.textAreaElement.style.display = "none";

        //Generate the bubbles!
        let bubbles = 0;
        let delay = 0;
        const MAX = 10;
        let landingPageTriggered = 0;
        for (let i = 0; i < MAX; i++) {
            bubbles = randInt(i, 4 * i);
            delay = randInt(100, 200);

            for (let j = 0; j < bubbles; j++) {
                this.createBubble(body);
                await sleep(5);
            }
            if (i > MAX * (4/5) && !landingPageTriggered) {
                //Slide the landing page.
                let landingPage = document.getElementById("landingPage");
                landingPage.classList.add("landingPageSlide");
                landingPageTriggered = 1;
            }
            await sleep(delay);
        }
        //Slide banner.
        let banner = document.getElementById("landingPageBanner");
        banner.classList.add("bannerSlide");

        //Logo transition.
        let logoTextElem = document.getElementById("logoText");
        let logoGearElem = document.getElementById("logoGear");
        let logoEElem = document.getElementById("logoE");

        logoTextElem.classList.add("logoTextSlide");
        await sleep(10);
        logoGearElem.classList.add("logoGearSlide");
        logoEElem.classList.add("logoESlide");

        await sleep(1000);
        //Bring the text in.
        let landingCaption = document.getElementById("landingPageText");
        landingCaption.classList.add("landingTextSlide");
    }

    createBubble(body) {
        let testBubble = document.createElement("div");
        testBubble.classList.add("bubbles");
        let dim = randInt(this.bubbleMinSize, this.bubbleMaxSize);
        testBubble.style.height = `${dim}px`;
        testBubble.style.width = `${dim}px`;
        testBubble.style.borderRadius = `${dim / 2}px`;

        let offset = randInt(-10, 100);
        testBubble.style.left = `${offset}%`;

        body.appendChild(testBubble);
    }
}

//https://stackoverflow.com/questions/43148625/how-to-make-a-live-html-preview-textarea-safe-against-html-script-injection
//Not quite sure if this is necessary, but probably better safe.
function sanitize(text) {
    //regex this with /g modifier
    var sanitized = text.replace("<script>", "");
    sanitized = sanitized.replace("</script>", "");
    return sanitized;
}

function randInt(min, max) {
    return Math.random() * (max - min) + min;
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function onload() {
    var handler = new cmdHandler();

    document.addEventListener('keydown', (e) => {
        if (e.code == "Enter") {
            handler.cmdIn();
            //DON'T make a new line.
            e.preventDefault();
        }
    })
}