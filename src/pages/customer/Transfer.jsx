import React, { useState } from 'react';
import { AuthContext } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Transfer() {
    const apiUrl = process.env.REACT_APP_API_URL
    const { isCustAuthenticated, idC } = React.useContext(AuthContext);
    const [NoRekTujuan, setNorek] = useState('');
    const [Nominal, setNominal] = useState('');
    const [masukanpin, setMasukanPin] = useState(false);
    const [valid, setValid] = useState(false);
    const [pin, setPin] = useState([]);
    const [error, setError] = useState('');
    const [Pin, setPinString] = useState('')
    const history = useNavigate()

    if (!isCustAuthenticated) {
        history('/login');
    }

    const DariRekId = idC.ID
    const handleTransfer = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${apiUrl}/transfer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ DariRekId, NoRekTujuan, Nominal, Pin }), // Kirim PIN sebagai bagian dari data JSON
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Terjadi kesalahan saat transfer');
            }

            alert('Transfer Berhasil')
            history('/dashboard')
            console.log(data);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message || 'Terjadi kesalahan saat transfer');
        }
    }

    function gotopin(e) {
        e.preventDefault();
        setMasukanPin(true);
    }

    function oftopin() {
        setMasukanPin(false);
    }

    function handleChangePin(e) {
        const { value, name } = e.target;
        const updatedPin = [...pin]; // Salin array PIN yang ada
        updatedPin[name] = value; // Simpan nilai PIN pada indeks yang sesuai
        setPin(updatedPin);

        // Jika input pada indeks 0-4 sudah terisi, otomatis pindah ke indeks berikutnya
        const nextIndex = parseInt(name) + 1;
        if (nextIndex <= 5 && value !== '') {
            document.getElementById(`pin${nextIndex}`).focus();
        }

        const prevIndex = parseInt(name) - 1;
        if (prevIndex >= 0 && value === '') {
            document.getElementById(`pin${prevIndex}`).focus();
        }
        const pinString = updatedPin.join('');
        setPinString(pinString);
    }

    function handleNorekChange(e) {
        const { value } = e.target;
        setNorek(value);

        setValid(false)
        if (value.trim() !== '' && value.length === 6) {
            document.getElementById('nominal').focus();
        }
    }

    function back() {
        history('/dashboard')
    }

    const cekNorek = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${apiUrl}/cek-rekening`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ NoKartu: NoRekTujuan, RekId: idC.ID }), // Kirim PIN sebagai bagian dari data JSON
            });
            const datas = await response.json();
            if (!response.ok) {
                throw new Error(datas.error || 'Username atau Password salah');
             }
            setError('')
            setValid(true)
        } catch (Error) {
            setValid(false)
            console.error(Error);
            setError(Error.message);
        }
    }

    return (
        <div className='flex'>
            <div className='h-screen overflow-hidden'>
                <div className='bg-blue-700 w-screen h-1/2 rounded-3xl rounded-t-none'>
                    <div className='p-4 font-extrabold text-4xl text-white justify-between flex'>
                        <div>
                            Transfer
                        </div>
                        <div className='font-medium right-10 text-xl absolute z-10'>
                            <button onClick={back}>Back</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full h-full flex absolute justify-center'>
                <div className='bg-blue-900 w-4/6 h-2/3 absolute self-center rounded-2xl shadow-black shadow-lg'>
                    <form onSubmit={handleTransfer} className='h-5/6 w-full flex flex-col'>
                        <div className='bg-white h-full rounded-xl m-2 mb-0 flex justify-between'>
                            <div className='p-10'>
                                <div className="form-group m-3 flex flex-col w-full">
                                    <label htmlFor="noRekTujuan" className='mb-1 text-black font-semibold'>Norek tujuan</label>
                                    <input type="number" id="noRekTujuan" name="noRekTujuan" value={NoRekTujuan} onChange={handleNorekChange} className='border-blue-900 mt-2 border-2 p-2 rounded-lg w-96' autoFocus />
                                    {error && <div style={{ color: 'red' }}>{error}</div>}
                                </div>
                                <div className="form-group m-3 flex flex-col w-full">
                                    <label htmlFor="nominal" className='mb-1 text-black font-semibold'>Nominal</label>
                                    <input type="number" id="nominal" name="nominal" value={Nominal} onChange={(e) => setNominal(e.target.value)} className='border-blue-900 mt-2 border-2 p-2 rounded-lg w-96' />
                                </div>
                                <button type="button" className="btn btn-primary w-96 mx-3" onClick={cekNorek}>Check</button>
                            </div>
                            <div className='m-10 text-4xl font-extrabold text-green-600'>
                                <img src="/c.jpg" alt="P" className='w-64' />
                            </div>
                        </div>
                        {valid? (
                            <button type="button" className="btn w-100 text-2xl text-white" onClick={gotopin}> <div className='text-2xl font-bold'>Send</div></button>
                        ) : (
                            <div className='text-2xl font-bold text-center w-100 text-gray-400 mt-2'>Send</div>
                        )}
                        {masukanpin ? (
                            <div className='absolute bg-transparent h-[99vh] w-screen self-center -translate-y-24 justify-center backdrop-blur-xl flex' >
                                <button className='w-screen h-[99dvh]' onClick={oftopin}>A</button>
                                <div className='absolute bg-white h-[70vh] w-[40vw] self-center rounded-2xl flex flex-col items-center shadow-black shadow-lg'>
                                    <div className='font-extrabold text-4xl mt-4'>
                                        Masukkan Pin
                                    </div>
                                    <div className='flex gap-2 mt-5'>
                                        {Array.from(Array(6).keys()).map((_, index) => (
                                            <input
                                                key={index}
                                                type="password"
                                                maxLength={1}
                                                className="border-2 p-2 w-12 text-center rounded-lg focus:outline-none"
                                                value={pin[index] || ''}
                                                onChange={handleChangePin}
                                                name={index.toString()}
                                                id={`pin${index}`} 
                                            />
                                        ))}
                                    </div>
                                    {error && <div style={{ color: 'red' }}>{error}</div>}
                                    <button type="submit" className="btn btn-primary w-96 justify-self-end mt-40">Submit</button>
                                </div>
                            </div>

                        ) : ''}
                    </form>
                </div>
            </div>
        </div>
    );
}
