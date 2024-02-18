import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import earth from './assets/earthrotate.gif'
import waiting from './assets/waiting.gif'
import baderror from './assets/baderror.gif'
import './components/App.css'

function App() {
    const promptText = useRef()
    const [imgurl, setimgurl] = useState('https://t4.ftcdn.net/jpg/00/97/58/97/360_F_97589769_t45CqXyzjz0KXwoBZT9PRaWGHRk5hQqQ.jpg')
    const secretkey = import.meta.env.VITE_META_DATA
    const [apirunning, setapirunning] = useState(false)

    useEffect(() => {
        let mytext = document.querySelector('.textarea')
        mytext.addEventListener('keyup', e => {
            mytext.style.height = '30px';
            let scheight = e.target.scrollHeight;
            mytext.style.height = `${scheight}px`
        })
    }, []);

    const handleGenerate = () => {
        if (!apirunning) {
            if (promptText.current.value !== '') {
                setapirunning(true);
                makethework();
            } else {
                promptText.current.setAttribute('placeholder', "Prompt can't be empty")
            }
        }
    }


    useEffect(() => {
        let earthele = document.querySelector('.earthclass')
        let textdiv = document.getElementById('clickto')
        if (apirunning) {
            promptText.current.setAttribute("disabled", "disabled")
            textdiv.style.display = 'none'
            earthele.style.display = 'block'
            gsap.to('#buttondiv', 1, { css: { width: '60px', backgroundColor: '#000' } })
            gsap.from(earthele, 1, { opacity: 0, delay: 1 })
        } else {
            promptText.current.removeAttribute("disabled")
            earthele.style.display = 'none'
            textdiv.style.display = 'block'
            gsap.to('#buttondiv', 1, { css: { width: '200px', backgroundColor: '#b885fe' } })
            gsap.from(textdiv, 1, { opacity: 0, delay: 1 })
        }
    }, [apirunning]);


    async function makethework() {
        setimgurl(waiting)
        await fetch(
            "https://api.openai.com/v1/images/generations",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer "+secretkey,
                    "User-Agent": "Chrome",
                },
                body: JSON.stringify({

                    prompt: promptText.current.value,
                    n: 1,
                    size: "512x512"
                }),
            }
        ).then(async response => {
            const data = await response.json()
            if (!response.ok) {
                throw new Error('Error at backend')
            }
            return data
        }).then(data => {
            setimgurl(data.data[0].url)
            setapirunning(false)
        }).catch(error => {
            promptText.current.value = 'Cannot process this prompt..'
            setapirunning(false)
            console.log(error)
            setimgurl(baderror)
        })
    }
    return (

        <div className='overflow-hidden h-[100vh] w-[100vw] bg-[#1d024f] flex flex-col justify-center items-center'>
            <div id='maindiv' className='rounded-2xl overflow-hidden py-[20px] h-auto w-[350px] md:w-[500px] bg-[#ffffff81] flex flex-col items-center'>
                <div className='headdivv'>
                    <p className='text-center heading pb-[15px] text-4xl font-bold'>A.I IMAGE GENERATOR</p>
                </div>
                <img id='imagetag' className='rounded-xl w-[256px] h-[256px]' src={imgurl} alt="" />
                <textarea ref={promptText} className='textarea mt-[30px] px-4' placeholder='Enter prompt here' ></textarea>
                <div id='buttondiv' onClick={handleGenerate} className='overflow-hidden flex cursor-pointer justify-center items-center mt-5 bg-[#b885fe] text-white rounded-2xl w-[200px] h-[50px]'>
                    <p id='clickto'>Click To Generate</p>
                    <img className='earthclass w-[40px] h-[40px] hidden' src={earth} alt="" />
                </div>
            </div>
        </div>



    )
}

export default App
