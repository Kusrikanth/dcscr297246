import { useRef, useState, useEffect } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
    Megaphone01Icon,
    StopCircleIcon,
    Mic01Icon,
    MicOff01Icon,
} from '@hugeicons-pro/core-stroke-standard'

interface ITextToVoiceEditorProps {
    value: string
    onChangeHndlr: any
    rows?: number
}

export default function TextToVoiceEditor(props: ITextToVoiceEditorProps) {
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
    const recognitionRef = useRef<any>(null)
    const latestValueRef = useRef(props.value);

    useEffect(() => {
        latestValueRef.current = props.value;
    }, [props.value]);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const SpeechRecognition =
                (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
            const recognition = new SpeechRecognition()
            recognition.continuous = false
            recognition.interimResults = false
            recognition.lang = 'en-US'

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                const newText = latestValueRef.current?.trim()
                    ? latestValueRef.current + ' ' + transcript
                    : transcript;

                props.onChangeHndlr({ target: { value: newText } });
            }

            recognition.onstart = () => setIsListening(true)
            recognition.onend = () => setIsListening(false)
            recognition.onerror = () => setIsListening(false)

            recognitionRef.current = recognition
        }
    }, [])

    const speakText = (text: string, lang = 'en-US') => {
        if (!text.trim()) return
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel()
            setIsSpeaking(false)
            return
        }

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = lang

        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)

        utteranceRef.current = utterance
        speechSynthesis.speak(utterance)
    }

    const stopSpeaking = () => {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel()
            setIsSpeaking(false)
        }
    }

    const toggleListening = () => {
        if (!recognitionRef.current) return
        if (isListening) {
            recognitionRef.current.stop()
        } else {
            recognitionRef.current.start()
        }
    }

    return (
        <>
            <div className="tw-relative tw-w-full tw-max-w-md tw-mb-4 tw-border tw-border-gray-300 tw-rounded-md tw-px-3 tw-py-2 tw-text-gray-700 tw-bg-white">
                <textarea
                    rows={props.rows || 5}
                    placeholder="Type your message or speak..."
                    className="tw-w-full tw-resize-none"
                    onChange={(e) => props.onChangeHndlr(e)}
                    value={props.value}
                />

                <div className="tw-mt-2 tw-flex tw-gap-3">
                    <HugeiconsIcon
                        icon={isSpeaking ? StopCircleIcon : Megaphone01Icon}
                        onClick={() => (isSpeaking ? stopSpeaking() : speakText(props.value, 'en-US'))}
                        className="tw-text-gray-600 hover:tw-text-black tw-cursor-pointer"
                    />

                    <HugeiconsIcon
                        icon={isListening ? MicOff01Icon : Mic01Icon}
                        onClick={toggleListening}
                        className={`tw-text-${isListening ? 'red-500' : 'gray-600'} hover:tw-text-black tw-cursor-pointer`}
                    />
                </div>
            </div>
        </>
    )
}
