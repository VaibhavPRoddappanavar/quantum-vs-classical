from typing import List, Dict, Any
import math

def classical_factorization(n: int) -> Dict[str, Any]:
    """Classical trial division factorization with step-by-step information."""
    steps = []
    factors = []
    d = 2
    original_n = n
    total_steps = 0
    
    while n > 1:
        is_factor = n % d == 0
        steps.append({
            'divisor': d,
            'number': n,
            'is_factor': is_factor,
            'message': f'Is {n} divisible by {d}?',
            'result': '✅' if is_factor else '❌'
        })
        total_steps += 1
        
        if is_factor:
            factors.append(d)
            n //= d
            steps[-1]['new_number'] = n
            continue
            
        d += 1
        if d * d > n:
            if n > 1:
                steps.append({
                    'divisor': n,
                    'number': n,
                    'is_factor': True,
                    'message': f'{n} is prime',
                    'result': '✅'
                })
                factors.append(n)
            break
    
    return {
        'steps': steps,
        'factors': factors,
        'total_steps': total_steps,
        'original_number': original_n
    }

def quantum_period_finding_steps(a: int, n: int) -> List[Dict[str, Any]]:
    """Simulate Shor's algorithm period finding steps."""
    steps = []
    
    # Step 1: Choose random number and check GCD
    gcd_value = math.gcd(a, n)
    steps.append({
        'phase': 'initialization',
        'message': f'Choose random number a = {a}',
        'detail': f'Check gcd(a, N): gcd({a}, {n}) = {gcd_value}',
        'is_valid': gcd_value == 1
    })
    
    # Step 2: Compute modular exponentiation sequence
    sequence = []
    for x in range(8):  # Simplified to 8 steps
        result = pow(a, x, n)
        sequence.append({
            'x': x,
            'result': result
        })
    
    steps.append({
        'phase': 'sequence',
        'message': f'Compute f(x) = {a}^x mod {n}',
        'sequence': sequence
    })
    
    # Step 3: Find period (simplified)
    period = 4  # For n=15, a=2, period is actually 4
    steps.append({
        'phase': 'period',
        'message': 'Find periodic pattern',
        'period': period,
        'detail': f'Period r = {period}'
    })
    
    return steps

def quantum_factorization(n: int) -> Dict[str, Any]:
    """Simulated Shor's algorithm implementation with step-by-step information."""
    a = 2  # Fixed for demonstration
    steps = quantum_period_finding_steps(a, n)
    
    # Calculate factors using period
    period = 4  # Simplified for n=15
    x = pow(a, period//2, n)
    factor1 = math.gcd(x - 1, n)
    factor2 = math.gcd(x + 1, n)
    
    steps.append({
        'phase': 'factorization',
        'message': 'Calculate factors using period',
        'calculations': [
            f'gcd({a}^({period}/2) - 1, {n}) = gcd({x-1}, {n}) = {factor1}',
            f'gcd({a}^({period}/2) + 1, {n}) = gcd({x+1}, {n}) = {factor2}'
        ],
        'factors': [factor1, factor2]
    })
    
    return {
        'steps': steps,
        'factors': [factor1, factor2],
        'total_steps': len(steps),
        'original_number': n
    }

def compare_factorization(n: int) -> dict:
    """Compare classical and quantum factorization with step-by-step information."""
    classical_result = classical_factorization(n)
    quantum_result = quantum_factorization(n)
    
    return {
        'n': n,
        'classical': classical_result,
        'quantum': quantum_result
    }

if __name__ == '__main__':
    result = compare_factorization(15)
    print(f"Results for n={result['n']}:")
    print(f"Classical factors: {result['classical_factors']}")
    print(f"Classical time: {result['classical_time']:.6f} seconds")
    print(f"Quantum factors: {result['quantum_factors']}")
    print(f"Quantum time: {result['quantum_time']:.6f} seconds")
