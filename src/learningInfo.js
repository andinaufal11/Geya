import {programs,schedule,branches} from './content.js';
export function describeSubjects({programId=null,branchId=null,subject=null}={}){
 const program=programs.find(p=>p.id===programId);const branch=branches.find(b=>b.id===branchId);
 if(program)return 'Gambaran materi persiapan '+program.name+':\n'+program.subjects.map(item=>'• '+item).join('\n')+'\nRincian materi dan ketersediaan kelas'+(branch?' cabang '+branch.name:'')+' perlu dikonfirmasi kepada admin.';
 if(branch&&branch.id!=='nunukan')return 'Daftar pelajaran khusus cabang '+branch.name+' belum tersedia di website. Geya memperkenalkan persiapan Kedinasan, TNI, dan Polri. Hubungi admin untuk memastikan materi dan kelas cabang tersebut.';
 const subjects=schedule.filter(item=>!subject||item.name===subject);
 return 'Pelajaran yang tercantum untuk kelas AK8 Nunukan:\n'+subjects.map(item=>'• '+item.name+': '+item.description).join('\n')+'\nKamu tertarik persiapan Kedinasan, TNI, atau Polri? Aku bisa jelaskan gambaran materinya juga.';
}