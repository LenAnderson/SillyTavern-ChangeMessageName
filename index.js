import { characters, chat, eventSource, event_types, saveChatDebounced } from '../../../../script.js';
import { AutoComplete } from '../../../autocomplete/AutoComplete.js';
import { AutoCompleteNameResult } from '../../../autocomplete/AutoCompleteNameResult.js';
import { AutoCompleteOption } from '../../../autocomplete/AutoCompleteOption.js';
import { enumIcons } from '../../../slash-commands/SlashCommandCommonEnumsProvider.js';


const listen = async()=>{
    const els = /**@type {HTMLElement[]}*/([...document.querySelectorAll('#chat .mes_block .name_text:not([data-stcmn])')].filter(it=>!it.closest('.template_element')));
    for (const el of els) {
        let ok;
        let cancel;
        el.setAttribute('data-stcmn', '1');
        el.style.cursor = 'pointer';
        el.title = 'Click to change name';
        el.addEventListener('click', ()=>{
            el.style.display = 'none';
            const inp = document.createElement('input'); {
                inp.value = el.textContent.trim();
                inp.style.background = 'none';
                inp.style.border = 'none';
                inp.style.font = 'inherit';
                inp.style.color = 'inherit';
                inp.style.marginBottom = '-3px';
                inp.style.borderBottom = '1px solid var(--SmartThemeBodyColor)';
                const ac = new AutoComplete(
                    inp,
                    ()=>true,
                    async(text)=>new AutoCompleteNameResult(text, 0, characters.map(c=>new AutoCompleteOption(c.name, enumIcons.character))),
                    true,
                );
                inp.addEventListener('keydown', evt=>{
                    switch (evt.key) {
                        case 'Enter': {
                            ok.click();
                            break;
                        }
                        case 'Escape': {
                            cancel.click();
                            break;
                        }
                    }
                });
                el.insertAdjacentElement('afterend', inp);
                inp.select();
            }
            const acts = document.createElement('span'); {
                acts.style.height = '1px';
                acts.style.display = 'inline-flex';
                ok = document.createElement('span'); {
                    ok.classList.add('menu_button');
                    ok.classList.add('menu_button_icon');
                    ok.style.margin = '0';
                    ok.style.height = '1lh';
                    ok.title = 'Accept changes';
                    ok.addEventListener('click', async()=>{
                        el.textContent = inp.value.trim();
                        inp.remove();
                        acts.remove();
                        el.style.display = '';
                        const id = Number(el.closest('[mesid]').getAttribute('mesid'));
                        el.textContent = inp.value;
                        const char = characters.find(it=>it.name == inp.value);
                        const ava = char ? `/thumbnail?type=avatar&file=${char.avatar}` : '/img/ai4.png';
                        el.closest('.mes').querySelector('.avatar > img').src = ava;
                        el.style.display = '';
                        chat[id].name = inp.value;
                        chat[id].force_avatar = ava;
                        chat[id].original_avatar = ava;
                        saveChatDebounced();
                    });
                    const icon = document.createElement('span'); {
                        icon.classList.add('fa-solid');
                        icon.classList.add('fa-save');
                        ok.append(icon);
                    }
                    acts.append(ok);
                }
                cancel = document.createElement('span'); {
                    cancel.classList.add('menu_button');
                    cancel.classList.add('menu_button_icon');
                    cancel.style.margin = '0';
                    cancel.style.height = '1lh';
                    cancel.title = 'Cancel';
                    cancel.addEventListener('click', ()=>{
                        el.textContent = inp.value.trim();
                        inp.remove();
                        acts.remove();
                        el.style.display = '';
                    });
                    const icon = document.createElement('span'); {
                        icon.classList.add('fa-solid');
                        icon.classList.add('fa-circle-xmark');
                        cancel.append(icon);
                    }
                    acts.append(cancel);
                }
                inp.insertAdjacentElement('afterend', acts);
            }
        });
    }
};

eventSource.on(event_types.CHARACTER_MESSAGE_RENDERED, ()=>listen());
eventSource.on(event_types.USER_MESSAGE_RENDERED, ()=>listen());
eventSource.on(event_types.CHAT_CHANGED, ()=>listen());
