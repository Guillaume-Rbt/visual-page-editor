export function Loader() {
    return (
        <div className='w-full h-full flex justify-center items-center'>
            <div className='w-1/12 min-w-[24px] square'>
                <svg
                    className='w-full h-f
                ull animate-spin'
                    viewBox='0 0 50 50'>
                    <circle
                        cx='25'
                        cy='25'
                        r='20'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='5'
                        className='text-dark/20'
                    />

                    <circle
                        cx='25'
                        cy='25'
                        r='20'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='4'
                        strokeLinecap='round'
                        strokeDasharray='50 100'
                        className='text-primary'
                    />
                </svg>
            </div>
        </div>
    );
}
